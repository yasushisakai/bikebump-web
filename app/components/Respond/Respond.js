import React, { PropTypes } from 'react'

import { 
contents,
} from 'styles/styles.css'

import { 
  QuestionPanelContainer,
  MapAndStreetViewContainer,
  StreetSideContainer,
  TinyMapContainer, 
  SurveyContainer,
  } from 'containers'

import {
  info, 
  mapAndStreetView,
  map,
  streetView, 
  question, 
  options, 
  singleOption,
  refreshQuestion,
  refreshButton
} from './styles.css'

Respond.propTypes = {
  dingId: PropTypes.string,
  questionId:PropTypes.string,
  onClickOption: PropTypes.func.isRequired,
  onClickNext : PropTypes.func.isRequired,
}


export default function Respond (props) {

  // function optionsConverter(options){
  //   const optionDivs = options.map((option,index)=> (
  //     <div className={singleOption} key={index} onClick={()=>props.onClickOption(index)}> {option} </div>
  //     ))

  //   return optionDivs
  // }
  // return null
/*  return props.hasUnanswered 
   ?(
    <div className={contents} >
      <div className={info}>
        {props.dingId}
      </div>
      <div className={mapAndStreetView}>
        <div className={map}>
          <TinyMapContainer dingId={props.dingId}/>
        </div>
        <div className={streetView}>
          <StreetSideContainer dingId={props.dingId} />
        </div>
      </div>
      <div className={question}>
        <QuestionPanelContainer questionId={props.questionId} onClickOption={props.onClickOption}/>
      </div>
      <div className={footer} >
        <div className={nextButton} onClick={props.onClickNext}> next question</div>
      </div>
    </div>)
   : <div> {'no questions to ask, either pass by a ding or report by ringing the bell yourself!'} </div>
*/
  // example IDS
  // dingId
  // without closest road, -Kd_of9811Ar-vq68eJ5
  // with closest road, -KdfdFnJIhhpXBEfpSJa
  // 
  // question
  // -KbuetTkYHqA5cGSNHDO
  // -KbugLxBUoqOVyeiJpHv
  // 
  // userId

  function handleClickOption (option) {
    console.log(option)
  }

  function handleRefresh () {
    console.log('refresh!')
  }

   return (
     <div className={contents}>
       <div className={info}>
         {'info'}
       </div>
       <div className={mapAndStreetView}>
         <MapAndStreetViewContainer dingId={'-Kd_of9811Ar-vq68eJ5'} />
       </div>
       <div className={question}>
         <SurveyContainer questionId={'-KbuetTkYHqA5cGSNHDO'} onClickOption={handleClickOption}/>
       </div>
       <div className={ refreshQuestion }>
         <div className={ refreshButton } onClick={handleRefresh}> refresh </div>
       </div>
     </div>
   )

}
