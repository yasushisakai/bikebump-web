
// https://github.com/mattdiamond
//

// Copyright © 2013 Matt Diamond

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// change log
// records the last totalLength*bufferLen data
// develops the recBuffer

import InlineWorker from 'inline-worker'

export default class Recorder {
  config = {
    recordDuration: 4000, // in milliseconds
    bufferLen: 4096,
    numChannels: 1,
    // totalLength: 44, // Math.ceil((4 * 44100) / 4096)
    mimeType: 'audio/wav',
  };

  recording = false;

  callbacks = {
    getBuffer: [],
    exportWAV: [],
  };

  constructor (source, cfg) {
    Object.assign(this.config, cfg)
    this.context = source.context
    this.node = (this.context.createScriptProcessor ||
      this.context.createJavaScriptNode).call(this.context,
      this.config.bufferLen, this.config.numChannels, this.config.numChannels)

    this.node.onaudioprocess = (e) => {
      if (!this.recording) return

      var buffer = []
      for (var channel = 0; channel < this.config.numChannels; channel++) {
        buffer.push(e.inputBuffer.getChannelData(channel))
      }

      this.worker.postMessage({
        command: 'record',
        buffer,
      })
    }

    source.connect(this.node)
    this.node.connect(this.context.destination)    // this should not be necessary

    let self = {}
    // this runs in a separate thread
    this.worker = new InlineWorker(function () {
      let sampleRate // this is handled by the context
      let recordDuration
      let recLength
      let recBuffers // meat part!!
      let testBuffer
      let pivot
      let totalLength
      let numChannels
      let bufferLen

      // mapping message and functions
      this.onmessage = function (e) {
        switch (e.data.command) {
          case 'init':
            init(e.data.config)
            console.log('onmessage', e.data.config)
            break
          case 'record':
            record(e.data.buffer)
            break
          case 'exportWAV':
            exportWAV(e.data.type)
            break
          case 'getBuffer':
            getBuffer()
            break
          case 'clear':
            clear()
            break
        }
      }

      function init (config) {
        // initiation of values
        console.log(config)
        sampleRate = config.sampleRate
        recordDuration = config.recordDuration
        pivot = 0
        // fixed buffer that will be constantly overwritten
        recBuffers = []
        numChannels = config.numChannels
        bufferLen = config.bufferLen
        // get the closest int for recording the millisecond data
        totalLength = Math.ceil((recordDuration * sampleRate / 1000.0) / bufferLen)
        console.log(recordDuration, sampleRate, totalLength)
        recLength = bufferLen * totalLength
        initBuffers()
      }

      function record (inputBuffer) {
        for (var channel = 0; channel < numChannels; channel++) {
          recBuffers[channel][pivot] = inputBuffer[channel]
        }

        pivot++

        // loop
        if (pivot === totalLength) {
          pivot = 0
        }
      }

      function exportWAV (type) {
        let buffers = []

        for (let channel = 0; channel < numChannels; channel++) {
          // console.log(JSON.stringify(recBuffers[channel]))
          const developed = develop(recBuffers[channel], pivot)
          // console.log(JSON.stringify(developed))
          buffers.push(mergeBuffers(developed, recLength))
        }

        let interleaved
        if (numChannels === 2) {
          interleaved = interleave(buffers[0], buffers[1])
        } else {
          interleaved = buffers[0]
        }

        let dataview = encodeWAV(interleaved)
        let audioBlob = new Blob([dataview], {type: type})

        this.postMessage({command: 'exportWAV', data: audioBlob})
      }

      function getBuffer () {
        let buffers = []
        for (let channel = 0; channel < numChannels; channel++) {
          const developed = develop(recBuffers[channel])
          buffers.push(mergeBuffers(developed, recLength))
        }
        this.postMessage({command: 'getBuffer', data: buffers})
      }

      function clear () {
        initBuffers()
      }

      function initBuffers () {
        for (let channel = 0; channel < numChannels; channel++) {
          recBuffers[channel] = []
          for (let bin = 0; bin < totalLength; bin++) {
            recBuffers[channel][bin] = []
          }
        }
      }

      // flatten rec buffers to one long array
      function mergeBuffers (recBuffers, recLength) {
        let result = new Float32Array(recLength)
        let offset = 0
        for (let i = 0; i < recBuffers.length; i++) {
          // layouted in a serial way recBuf[0][0], recBuf[0][1], ..., recBuf[0][n], recBuf[1][0], recBuf[1][1], ..., recBuf[1][n], ... recBuf[m][n]
          result.set(recBuffers[i], offset)
          offset += recBuffers[i].length
        }
        return result
      }

      //
      // creates a new array with the right order
      // breaks the array at the pivot point
      // concats the latter part to the formor part
      //
      function develop (recBuffer, pivot) {
        let copyBuffer = recBuffer.slice()
        let beginning = copyBuffer.splice(pivot)
        return beginning.concat(copyBuffer)
      }

      // intertwin the (two)
      function interleave (inputL, inputR) {
        let length = inputL.length + inputR.length
        let result = new Float32Array(length)

        let index = 0
        let inputIndex = 0

        while (index < length) {
          // L[0], R[0], L[1], R[1], ..., L[n], R[n]
          result[index++] = inputL[inputIndex]
          result[index++] = inputR[inputIndex]
          inputIndex++
        }
        return result
      }

      function floatTo16BitPCM (output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, input[i]))
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
        }
      }

      function writeString (view, offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i))
        }
      }

      function encodeWAV (samples) {
        let buffer = new ArrayBuffer(44 + samples.length * 2)
        let view = new DataView(buffer)

                /* RIFF identifier */
        writeString(view, 0, 'RIFF')
                /* RIFF chunk length */
        view.setUint32(4, 36 + samples.length * 2, true)
                /* RIFF type */
        writeString(view, 8, 'WAVE')
                /* format chunk identifier */
        writeString(view, 12, 'fmt ')
                /* format chunk length */
        view.setUint32(16, 16, true)
                /* sample format (raw) */
        view.setUint16(20, 1, true)
                /* channel count */
        view.setUint16(22, numChannels, true)
                /* sample rate */
        view.setUint32(24, sampleRate, true)
                /* byte rate (sample rate * block align) */
        view.setUint32(28, sampleRate * 4, true)
                /* block align (channel count * bytes per sample) */
        view.setUint16(32, numChannels * 2, true)
                /* bits per sample */
        view.setUint16(34, 16, true)
                /* data chunk identifier */
        writeString(view, 36, 'data')
                /* data chunk length */
        view.setUint32(40, samples.length * 2, true)

        floatTo16BitPCM(view, 44, samples)

        return view
      }
    }, self)

    this.worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        recordDuration: this.config.recordDuration,
        numChannels: this.config.numChannels,
        bufferLen: this.config.bufferLen,
      },
    })

    this.worker.onmessage = (e) => {
      let cb = this.callbacks[e.data.command].pop()
      if (typeof cb === 'function') {
        cb(e.data.data)
      }
    }
  }

  record () {
    this.recording = true
  }

  stop () {
    this.recording = false
  }

  clear () {
    this.worker.postMessage({command: 'clear'})
  }

  getBuffer (cb) {
    cb = cb || this.config.callback
    if (!cb) throw new Error('Callback not set')

    this.callbacks.getBuffer.push(cb)

    this.worker.postMessage({command: 'getBuffer'})
  }

  exportWAV (cb, mimeType) {
    this.recording = false
    mimeType = mimeType || this.config.mimeType
    cb = cb || this.config.callback
    if (!cb) throw new Error('Callback not set')

    this.callbacks.exportWAV.push(cb)

    this.worker.postMessage({
      command: 'exportWAV',
      type: mimeType,
    })
    this.recording = true
  }

  static
    forceDownload (blob, filename) {
      let url = (window.URL || window.webkitURL).createObjectURL(blob)
      let link = window.document.createElement('a')
      link.href = url
      link.download = filename || 'output.wav'
      let click = document.createEvent('Event')
      click.initEvent('click', true, true)
      link.dispatchEvent(click)
    }
}
