import React, { PropTypes } from 'react'
import { contents } from 'styles/styles.css'
import { StreetViewContainer, TinyMapContainer, QuestionPanelContainer } from 'containers'
import {
  info, 
  mapAndStreetView,
  map,
  streetView, 
  question, 
  options, 
  singleOption,
  footer,
  nextButton,
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
  return props.hasUnanswered 
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
          <StreetViewContainer dingId={props.dingId} />
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
}