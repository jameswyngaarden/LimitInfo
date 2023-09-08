var jsPsych = initJsPsych();
    
var Bonus_select='Did Not Select';
var Bonus_p1=0.5;
var Bonus_val='$0';
var Risk_trial=0;
var Bonus_trial=5;
// capture info from Prolific
var subject_id = 'sub-'+jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');
var Prolink;


jsPsych.data.addProperties({
    subID: subject_id,
    study_id: study_id,
    session_id: session_id,
    navigator_language: navigator.language,
    navigator_UA: navigator.userAgent,
    //coords:IPinfo
  });
  
// Setting up and randomizing conditions
var block_colors=jsPsych.randomization.repeat(['red','green','blue'],1);
var narrow_p1=[.2,.3,.3,.4,.4,.4,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.6,.6,.6,.7,.7,.8];
var wide_p1=[.0,.0,.0,.0,.0,.1,.1,.1,.2,.2,.3,.7,.8,.8,.9,.9,.9,1.0,1.0,1.0,1.0,1.0];
var skew_p1=narrow_p1.map(function(x) { return x +.2; });
var block_dist=jsPsych.randomization.sampleWithReplacement([[['narrow',narrow_p1],['wide',wide_p1],['skew',skew_p1]],
 [['wide',wide_p1],['narrow',narrow_p1],['skew',skew_p1]],[['narrow',narrow_p1],['skew',skew_p1],['wide',wide_p1]],
 [['skew',skew_p1],['narrow',narrow_p1],['wide',wide_p1]]],1,[.25,.25,.25,.25])
 block_dist=block_dist[0]

 
/* create timeline */
var timeline = [];
var preload = {
  type: jsPsychPreload,
  images: ['img0.jpg', 'img1.jpg','img2.jpg','img3.jpg','img4.jpg','img5.jpg','img6.jpg','img7.jpg','img8.jpg','img9.jpg',
  'img10.jpg','img11.jpg','img12.jpg','img13.jpg','img14.jpg','img15.jpg','img16.jpg','img17.jpg','img18.jpg','img19.jpg',
  'img20.jpg','img21.jpg','img22.jpg','img23.jpg','img24.jpg','img25.jpg','img26.jpg','img27.jpg',]
};

// Setting up instructions for the first half of the experimetn
var R_instruct_stim=[ {stim:'img0.jpg'},{stim:'img1.jpg'},{stim:'img2.jpg'},{stim:'img3.jpg'},{stim:'img4.jpg'},{stim:'img5.jpg'},
  {stim:'img6.jpg'},{stim:'img7.jpg'},{stim:'img8.jpg'},{stim:'img9.jpg'},{stim:'img10.jpg'}];
var inst = {
  type: jsPsychImageKeyboardResponse,
  stimulus: jsPsych.timelineVariable('stim')}
  
var Risk_instruct = {timeline: [inst], timeline_variables: R_instruct_stim};
var Mem_instruct_stim=[{stim:'img10.jpg'}];
var Mem_instruct = {timeline: [inst], timeline_variables: Mem_instruct_stim};


/// #########################################################################################
/// ###########################CODE FOR ALL OF THE #########################################3
///########################## RISK SECTION          #####################################3
///#########################################################################################


// Main Function for trial drawing
function drawPie(c,p1,color,pos) {
  var ctx = c.getContext("2d");
   ctx.textAlign = "center"; 
  //Set inner variables from input data
  p2=1-p1
  
  if (pos=='left'){
    var lotpos=[300,250];
    var lottext=[300]
    var safepos=[700,250];
  } else if (pos=='right') {
    var lotpos=[700,250];
    var lottext=[700]
    var safepos=[300,250];
  }
  
  
  // Colors
  if (color=='red') {
    var colors = ["rgba(255, 0, 0,1)","rgba(255, 0, 0,0.5)" ];
  } else if (color=='green') {
    var colors = ["rgba(0, 255, 0,1)","rgba(0, 255, 0,0.5)" ];
  } else if (color =='blue') {
    var colors = ["rgba(0, 0, 255,1)","rgba(0, 0, 255,0.5)" ];
  }
  
  // List of Angles
  var angles = [Math.PI * p1*2, Math.PI * p2*2];
  // Temporary variables, to store each arc angles
  var beginAngle = Math.PI/2;
  var endAngle = Math.PI/2;
  var ctx = c.getContext('2d');
  
  
  //outside Color circle
  ctx.beginPath();
  ctx.lineWidth=20
  ctx.strokeStyle='black'
  ctx.arc(lotpos[0], lotpos[1], 160, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.lineWidth = 15;
  ctx.strokeStyle=colors[0]
  ctx.arc(lotpos[0], lotpos[1], 160, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.lineWidth=3
  ctx.strokeStyle='black'
  ctx.closePath();

  // Iterate through the angles
  for(var i = 0; i < angles.length; i = i + 1) {
    // Begin where we left off
    beginAngle = endAngle;
    // End Angle
    endAngle = endAngle + angles[i];
    
    ctx.beginPath();
    // Fill color
    ctx.fillStyle = colors[i % colors.length];
    
    // Same code as before
    //ctx.moveTo(200, 200);
    ctx.arc(lotpos[0], lotpos[1], 120, beginAngle, endAngle);
    ctx.lineTo(lotpos[0], lotpos[1]);
    ctx.closePath();
    ctx.stroke();
    
    // Fill
    ctx.fill();
  ctx.beginPath()
  ctx.fillStyle='black'
  ctx.font = "48px serif";
  ctx.fillText("$3", safepos[0], safepos[1])
  ctx.fillText("$7", lottext[0]-8, lotpos[1]-60)
  pt=p1*100
  ctx.fillText(pt.toFixed(0)+'%', lottext[0], lotpos[1]+60)
  //ctx.strokeText(pt.toFixed(0)+'%', lottext[0], lotpos[1]+60)

  //ctx.fillText('+', 500, 250)
  ctx.closePath();
  ctx.stroke();
  }
};

// Main Function for Feedback
function highlight_select(c,p1,color,pos,select){
  Risk_trial+=1;
  var ctx = c.getContext("2d");
  if (Bonus_trial==Risk_trial){
    Bonus_p1=p1
      
      if (select==pos) {
        Bonus_select='risky';
        Bonus_val=jsPsych.randomization.sampleWithReplacement(['$7','$0'], 1, [Bonus_p1,1-Bonus_p1]);
      }
       if (!(select==pos)){
        Bonus_select='safe'
        Bonus_val='$3'}
  }
   ctx.textAlign = "center"; 
   if (select=='none'){
     ctx.font = "48px serif";
     ctx.fillText("Please Choose Quicker",500,250)}
   
   else if (select=='left'){
    var chosepos=[300,250];
    drawPie(c,p1,color,pos)
    hoverPath = new Path2D();
    ctx.strokeStyle="rgb(250,155,0)"
    ctx.lineWidth = 15;
    ctx.rect(chosepos[0]-200, chosepos[1]-200, 400, 400);
    ctx.closePath();
    ctx.stroke();} 
  else if (select=='right') {
    var chosepos=[700,250];
    drawPie(c,p1,color,pos)
  hoverPath = new Path2D();
  ctx.strokeStyle="rgb(250,155,0)"
  ctx.lineWidth = 15;
  ctx.rect(chosepos[0]-200, chosepos[1]-200, 400, 400);
  ctx.closePath();
  ctx.stroke();
  }
  
}
var Risk = {
      type: jsPsychCanvasKeyboardResponse,
      canvas_size: [500, 1000],
      stimulus: function(c) {
        drawPie(c,jsPsych.timelineVariable('p1'),
        jsPsych.timelineVariable('color'),
        jsPsych.timelineVariable('side'))
      },
        
      data: { dist:jsPsych.timelineVariable('dist'),
      p1: jsPsych.timelineVariable('p1'),
      color: jsPsych.timelineVariable('color'),
      side: jsPsych.timelineVariable('side'),
      Blocktype:'Risk',
      tnum:function() { 
      return Risk_trial; // the difficulty value changes during the experiment
    },
      },
      choices: ['f','j'],
      //prompt: '<p> Press "F" for the option on the left and "J" for the option on the Right</p>',
      trial_duration:4500,
    on_finish: function(data){

    if(jsPsych.pluginAPI.compareKeys(data.response, "f")){
      data.select = 'left';
      select='left';
      if (data.select==data.side){
      data.choice='risk'
    }
    else{
      data.choice='safe'
    }
      
    }
    else if(jsPsych.pluginAPI.compareKeys(data.response, "j")){
      data.select = 'right';
      select='right';
      if (data.select==data.side){
      data.choice='risk'
    }
    else{
      data.choice='safe'
    }
    }
    if (!(jsPsych.pluginAPI.compareKeys(data.response, "j") || jsPsych.pluginAPI.compareKeys(data.response, "f")))
    {
        data.select='none'
        select='none'
    }
    
    
      }
  
}


var feedback = {
 type: jsPsychCanvasKeyboardResponse,
 canvas_size: [500, 1000],
 stimulus: function(c) {
   
   var last_select= jsPsych.data.get().last(1).values()[0].select;
   p1=jsPsych.timelineVariable('p1');
   color=jsPsych.timelineVariable('color');
   side=jsPsych.timelineVariable('side');
   
   highlight_select(c,p1,color,side,last_select);},
   
   choices: "NO_KEYS",
   trial_duration:500
}

var ITI={
  type: jsPsychHtmlKeyboardResponse,
  stimulus:'<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 300
  
}

var Rblock1 = {
      timeline: [Risk,feedback,ITI],
      timeline_variables:[
      {dist: block_dist[0][0],p1: block_dist[0][1][0],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][1],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][2],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][3],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][4],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][5],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][6],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][7],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][8],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][9],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][10],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][11],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][12],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][13],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][14],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][15],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][16],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][17],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0],p1: block_dist[0][1][18],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[0][0], p1: block_dist[0][1][19],color:block_colors[0],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'}],
      randomize_order: true,
      repetitions: 0
    };
var Rblock2 = {
      timeline: [Risk,feedback,ITI],
      timeline_variables:[
      {dist: block_dist[1][0], p1: block_dist[1][1][0],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][1],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][2],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][3],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][4],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][5],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][6],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][7],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][8],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][9],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][10],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][11],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][12],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][13],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][14],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][15],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][16],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][17],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][18],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[1][0], p1: block_dist[1][1][19],color:block_colors[1],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'}],
      randomize_order: true,
      repetitions: 0
    };
var Rblock3 = {
      timeline: [Risk,feedback,ITI],
      timeline_variables:[
      {dist: block_dist[2][0], p1: block_dist[2][1][0],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][1],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][2],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][3],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][4],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][5],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][6],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][7],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][8],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][9],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][10],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][11],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][12],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][13],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][14],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][15],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][16],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][17],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][18],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'},
      {dist: block_dist[2][0], p1: block_dist[2][1][19],color:block_colors[2],side:jsPsych.randomization.sampleWithReplacement(['left','right'], 1),task:'risk'}],
      randomize_order: true,
      repetitions: 0
    };

/// #########################################################################################
/// ###########################CODE FOR ALL OF THE #########################################3
///########################## MEMORY QUESTIONAIRES          #####################################3
///#########################################################################################
var likert_scale = ["0","1","2","3","4","5","6","7","8","9","10"];
var Mem_instruct_stim=[
  {stim:'img11.jpg'}];

var Mem_instruct = {timeline: [inst], timeline_variables: Mem_instruct_stim};

var Mem_form={
  type:jsPsychSurveyHtmlForm,
  preamble: '<p>Please indicate how many times you saw each color lottery with the following chances of winning</b></p>',
  html: '<p> <b style="color:red;"> RED <br> 0%:<input name="R0" size="2" type="number" /> 10%:<input name="R10" size="2" type="number" />'+
  '20%:<input name="R20" type="number" size="2" /> 30%:<input name="R30" size="2" type="number" /> 40%:<input size="2" name="R40" type="number" />'+
  ' 50%:<input name="R50" size="2" type="number" /> 60%:<input name="R60" size="2" type="number" /> 70%:<input name="R70" size="2" type="number" />'+
  ' 80%:<input name="R80" size="2" type="number" /> 90%:<input name="R90"size="2" type="number" /> 100%:<input name="R100" size="2" type="number" /></b> <br>'+
  '<b style="color:green;"> GREEN <br> 0%:<input name="G0" size="2" type="number" /> 10%:<input name="G10" size="2" type="number" />'+
  '20%:<input name="G20" size="2" type="number" /> 30%:<input name="G30" size="2" type="number" /> 40%:<input name="G40" size="2" type="number" />'+
  ' 50%:<input name="G50" size="2" type="number" /> 60%:<input name="G60" size="2" type="number" /> 70%:<input name="G70" size="2" type="number" />'+
  ' 80%:<input name="G80"size="2" type="number" /> 90%:<input name="G90"size="2" type="number" /> 100%:<input name="G100" size="2" type="number" /></b> <br>'+
  '<b style="color:blue;"> Blue <br> 0%:<input name="B0" size="2" type="number" /> 10%:<input name="B10" size="2" type="number" />'+
  '20%:<input name="B20" size="2"type="number" /> 30%:<input name="B30" size="2" type="number" /> 40%:<input name="B40" size="2" type="number" />'+
  ' 50%:<input name="B50" size="2" type="number" /> 60%:<input name="B60" size="2" type="number" /> 70%:<input name="B70" size="2" type="number" />'+
  ' 80%:<input name="B80" size="2" type="number" /> 90%:<input name="B90" size="2" type="number" /> 100%:<input name="B100" size="2" type="number" /></b> <br>'
}
var Red_mem = {
  type: jsPsychSurveyLikert,
  preamble:"<p>How many times did you see a <b style='color:red;'>RED Lottery </b> with the given chance of winning?</p>",
  questions:[  
    {prompt: "<b style='color:red;'> 0%.", name: 'red_00%', labels: likert_scale,required: true},
    {prompt: "10%", name: 'red_10%', labels: likert_scale,required: true},
    {prompt: "20%", name: 'red_20%', labels: likert_scale,required: true},
    {prompt: "30%", name: 'red_30%', labels: likert_scale,required: true},
    {prompt: "40%", name: 'red_40%', labels: likert_scale,required: true},
    {prompt: "50%", name: 'red_50%', labels: likert_scale,required: true},
    {prompt: "60%", name: 'red_60%', labels: likert_scale,required: true},
    {prompt: "70%", name: 'red_70%', labels: likert_scale,required: true},
    {prompt: "80%", name: 'red_80%', labels: likert_scale,required: true},
    {prompt: "90%", name: 'red_90%', labels: likert_scale,required: true},
    {prompt: "100% </b> ", name: 'red_100%', labels: likert_scale,required: true}],
  randomize_question_order: false
};
var Blue_mem = {
  type: jsPsychSurveyLikert,
  preamble:"<p>How many times did you see a <b style='color:blue;'>BLUE Lottery </b> with the given chance of winning?</p>",
  questions:[  
    {prompt: "0%.", name: 'blue_00%', labels: likert_scale,required: true},
    {prompt: "10%", name: 'blue_10%', labels: likert_scale,required: true},
    {prompt: "20%", name: 'blue_20%', labels: likert_scale,required: true},
    {prompt: "30%", name: 'blue_30%', labels: likert_scale,required: true},
    {prompt: "40%", name: 'blue_40%', labels: likert_scale,required: true},
    {prompt: "50%", name: 'blue_50%', labels: likert_scale,required: true},
    {prompt: "60%", name: 'blue_60%', labels: likert_scale,required: true},
    {prompt: "70%", name: 'blue_70%', labels: likert_scale,required: true},
    {prompt: "80%", name: 'blue_80%', labels: likert_scale,required: true},
    {prompt: "90%", name: 'blue_90%', labels: likert_scale,required: true},
    {prompt: "100%", name: 'blue_100%', labels: likert_scale,required: true}],
  randomize_question_order: false
};
var Green_mem = {
  type: jsPsychSurveyLikert,
  preamble:"<p>How many times did you see a <b style='color:green;'>GREEN Lottery </b>with the given chance of winning?</p>",
  questions:[  
    {prompt: "0%.", name: 'green_00%', labels: likert_scale,required: true},
    {prompt: "10%", name: 'green_10%', labels: likert_scale,required: true},
    {prompt: "20%", name: 'green_20%', labels: likert_scale,required: true},
    {prompt: "30%", name: 'green_30%', labels: likert_scale,required: true},
    {prompt: "40%", name: 'green_40%', labels: likert_scale,required: true},
    {prompt: "50%", name: 'green_50%', labels: likert_scale,required: true},
    {prompt: "60%", name: 'green_60%', labels: likert_scale,required: true},
    {prompt: "70%", name: 'green_70%', labels: likert_scale,required: true},
    {prompt: "80%", name: 'green_80%', labels: likert_scale,required: true},
    {prompt: "90%", name: 'green_90%', labels: likert_scale,required: true},
    {prompt: "100%", name: 'green_100%', labels: likert_scale,required: true}],
  randomize_question_order: false,
  
};
//var mem_quest={timeline: [Mem_instruct,Red_mem,Blue_mem,Green_mem],randomize_order: false}
var mem_quest={timeline:[Mem_instruct,Mem_form]}



/// #########################################################################################
/// ###########################CODE FOR ALL OF THE #########################################3
///########################## AMBIGUITY WITH STAIRCASING          #####################################3
///#########################################################################################
var A_instruct_stim=[
  {stim:'img12.jpg'},{stim:'img13.jpg'},{stim:'img14.jpg'},
  {stim:'img15.jpg'},{stim:'img16.jpg'},{stim:'img17.jpg'},{stim:'img18.jpg'},
  {stim:'img19.jpg'},{stim:'img20.jpg'}];

var Aisk_instruct = {timeline: [inst], timeline_variables: A_instruct_stim};


var acolor=block_colors[0];
var ap1=0.50;
var astep_size = 0.2; // initial step size

var achoicehist=[];

var achoice;
var aTotalTrials=90;
var aTrialNum=0;
var A=[.25,.75]
var asides=['left','right'];
var aside=asides[Math.floor(Math.random()*asides.length)];
var adist=block_dist[0][0]
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


// Main Function for trial drawing

function drawAlot(c,p1,color,pos,A) {
  var ctx = c.getContext("2d");
   ctx.textAlign = "center"; 
  
  if (pos=='left'){
    var lotpos=[200,250];
    var lottext=[200]
    var safepos=[800,250];
  } else if (pos=='right') {
    var lotpos=[800,250];
    var lottext=[800]
    var safepos=[200,250];
  }
  
  // Colors
  if (color=='red') {
    var colors = ["rgba(255, 0, 0,1)","rgba(255, 0, 0,0.5)" ];
  } else if (color=='green') {
    var colors = ["rgba(0, 255, 0,1)","rgba(0, 255, 0,0.5)" ];
  } else if (color =='blue') {
    var colors = ["rgba(0, 0, 255,1)","rgba(0, 0, 255,0.5)" ];
  }
  
  //Set inner variables from input data
  p2=1-p1
  // List of Angles
  var angles = [Math.PI * p1*2, Math.PI * p2*2];
  var a_angles = [Math.PI * 0.5*2, Math.PI * 0.5*2];
  // Temporary variables, to store each arc angles
  var beginAngle = Math.PI/2;
  var endAngle = Math.PI/2;
  var ctx = c.getContext('2d');
  
  // Iterate through the angles for Risk
  for(var i = 0; i < angles.length; i = i + 1) {
    // Begin where we left off
    beginAngle = endAngle;
    // End Angle
    endAngle = endAngle + angles[i];
    
    ctx.beginPath();
    // Fill color
    ctx.fillStyle = colors[i % colors.length];
    
    // Same code as before
    //ctx.moveTo(200, 200);
    ctx.arc(lotpos[0], lotpos[1], 120, beginAngle, endAngle);
    ctx.lineTo(lotpos[0], lotpos[1]);
    ctx.closePath();
    ctx.stroke();
    
    // Fill
    ctx.fill();}
  // Iterate through the angles for AMB
  for(var i = 0; i < angles.length; i = i + 1) {
    // Begin where we left off
    beginAngle = endAngle;
    // End Angle
    endAngle = endAngle + a_angles[i];
    ctx.beginPath();
    // Fill color
    ctx.fillStyle = colors[i % colors.length];
    // Same code as before
    //ctx.moveTo(200, 200);
    ctx.arc(safepos[0], safepos[1], 120, beginAngle, endAngle);
    ctx.lineTo(safepos[0], safepos[1]);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();}
    
  //Inside Ambiguity Gray Mask
  // Begin where we left off
  beginAngle = (A[0]-.25)*2*Math.PI;
  // End Angle
  endAngle = (A[1]-.25)*2*Math.PI;
  ctx.beginPath();
  // Fill color
  ctx.fillStyle = "grey";
  // Same code as before
  //ctx.moveTo(200, 200);
  ctx.arc(safepos[0], safepos[1], 140, beginAngle, endAngle);
  ctx.lineTo(safepos[0], safepos[1]);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  
    
  
  //outside RiskColor circle
  ctx.beginPath();
  ctx.lineWidth=20
  ctx.strokeStyle='black'
  ctx.arc(lotpos[0], lotpos[1], 160, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.lineWidth = 15;
  ctx.strokeStyle=colors[0]
  ctx.arc(lotpos[0], lotpos[1], 160, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.lineWidth=3
  ctx.strokeStyle='black'
  ctx.closePath();
  
  //outside Ambiguity Color circle
  ctx.beginPath();
  ctx.lineWidth=20
  ctx.strokeStyle='black'
  ctx.arc(safepos[0], safepos[1], 160, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.lineWidth = 15;
  ctx.strokeStyle=colors[0]
  ctx.arc(safepos[0], safepos[1], 160, 0, 2 * Math.PI);
  ctx.stroke()
  ctx.lineWidth=3
  ctx.strokeStyle='black'
  ctx.closePath();

  
  
  
  // Text
  ctx.beginPath()
  ctx.fillStyle='black'
  ctx.font = "48px serif";
  ctx.fillText("$7", 500, 150)
  pt=p1*100
  ctx.fillText(pt.toFixed(0)+'%', lottext[0], lotpos[1]+60)
  ctx.fillText(A[0]*100+'% -'+A[1]*100+'%',
  safepos[0], safepos[1]+60)
  //ctx.strokeText(pt.toFixed(0)+'%', lottext[0], lotpos[1]f+60)

  //ctx.fillText('+', 500, 250)
  ctx.closePath();
  ctx.stroke();
  
}

function ahighlight_select(c,p1,color,pos,A,select){
  var ctx = c.getContext("2d");
   if (select=='none'){
     ctx.font = "48px serif";
     ctx.fillText("Please Choose Quicker",0,250)}
   else{ 
   if (select=='left'){
    var chosepos=[200,250];
  } else if (select=='right') {
    var chosepos=[800,250];
  }
  
   ctx.textAlign = "center"; 
  drawAlot(c,p1,color,pos,A)
  hoverPath = new Path2D();
  ctx.strokeStyle="rgb(250,155,0)"
  ctx.lineWidth = 15;
  ctx.rect(chosepos[0]-200, chosepos[1]-200, 400, 400);
  ctx.closePath();
  ctx.stroke();}
  
}
var afeedback = {
 type: jsPsychCanvasKeyboardResponse,
 canvas_size: [500, 1000],
 stimulus: function(c) {
  
   var last_select= jsPsych.data.get().last(1).values()[0].select;
   
   ahighlight_select(c,ap1,acolor,aside,A,last_select)},
   
   choices: "NO_KEYS",
   trial_duration:400
}

var AMB = {
      type: jsPsychCanvasKeyboardResponse,
      canvas_size: [500, 1000],
      stimulus: function(c){
        drawAlot(c,
        ap1,
        acolor,
        aside,
        A)},
      data: {
        dist:adist ,
        p1:ap1,
        color:acolor,
        side: asides,
        tnum:aTrialNum,
        Amb:A,
        Blocktype:'Ambiguity',
      },
      trial_duration:4500,
      choices: ['f','j'],
      //prompt: '<p> Press "F" for the option on the left and "J" for the option on the Right</p>',
      //trial_duration:5000,
    on_finish: function(data){
    data.per=ap1;
    data.dist=adist;
    data.color=acolor;
    data.side=aside;
    data.tnum=aTrialNum;
    data.Amb=A;
    if(jsPsych.pluginAPI.compareKeys(data.response, "f")){
      data.select = 'left';
      select='left';}
    if(jsPsych.pluginAPI.compareKeys(data.response, "j")){
      data.select = 'right';
      select='right;'}
    if (!(jsPsych.pluginAPI.compareKeys(data.response, "j") || jsPsych.pluginAPI.compareKeys(data.response, "f")))
    {
        data.select='none'
        select='none'
    }
    if(data.select==data.side){
      achoice = 'risk';
      data.choice='risk';
      }
    if(!(data.select==data.side)) {
      achoice = 'Ambiguous';
      data.choice='Ambiguous'
     }
  }
};

function updatep1() {
  aside=asides[Math.floor(Math.random()*asides.length)];
  achoicehist[aTrialNum % 2]=achoice // Keep track of the last two choices
  if (achoicehist[0]==achoicehist[1]){ // If the last two choices are the same
    astep_size*=1.5;} // Increase the stepsize
  else{ // If they're different
    astep_size*=.5;} // decrease the step size
  
  aTrialNum+=1 // keep track of the trial Number
	if (achoice == 'risk') { // if chose risk make less appealing by decreasing the prob to win
		ap1 -= astep_size;
	  ap1+= 0.01*getRandomInt(-2, 2); // jitter probability by + or - 0.00,0.01,0.02
	  ap1=Number(ap1.toFixed(2)); // round to nearest 0.01
	}
	else if (achoice == 'Ambiguous') {
	  ap1+= astep_size;
	  ap1+=0.01*getRandomInt(-3, 3);
	  ap1=Number(ap1.toFixed(2));
	}
	  
	if (ap1>1){ // probability can't be bigger than 100 or lower than 0
		 ap1=1;}
	if (ap1<0){
	    ap1=0;}
	    
	if (aTrialNum%15==0){
	  A=[0.0,1.0];
	  astep_size=0.2;
	  ap1=0.5;
	  achoicehist=[];
	} 
	if (aTrialNum==30){ //once we reach trial 11 start new block
	  acolor=block_colors[1];
	  astep_size=0.2;
	  ap1=0.5;
	  achoicehist=[];
	  A=[0.25,0.75];
	  adist=block_dist[1][0];
	}
	if (aTrialNum==60){
	  acolor=block_colors[2];
	  astep_size=0.2;
	  ap1=0.5;
	  achoicehist=[];
	  A=[0.25,0.75];
	  adist=block_dist[2][0]
	}
};
		
var staircase_assess = {type: jsPsychCallFunction,func: updatep1}
var staircase = {timeline: [AMB, afeedback, staircase_assess,ITI]};

//main procedure
var Ablock1 = {
	timeline: [staircase],
	timeline_variables:[],
	loop_function: function(){
		//if we haev reached the specified total trial amount, exit
		if(aTrialNum > (aTotalTrials-1)) {
			return false;
		} else {
			return true;
		}
	}
};

/// #########################################################################################
/// ###########################CODE FOR ALL OF THE #########################################3
///########################## Reinforcement AMBIGUITY          #####################################3
///#########################################################################################
var RL_instruct_stim=[ {stim:'img21.jpg'},{stim:'img22.jpg'},{stim:'img23.jpg'},{stim:'img24.jpg'},{stim:'img25.jpg'},{stim:'img26.jpg'},
  {stim:'img27.jpg'}];

var RL_instruct = {timeline: [inst], timeline_variables: RL_instruct_stim};
var RLp1=0.50;
var RLstep_size = 0.2; // initial step size

var RLchoicehist=[];
var RLwin;
var RLchoice;

var RLTotalTrials=15;
var RLTrialNum=1;

var RLA=[0.00, 1.00]
var RLsides=['left','right'];
var RLside=RLsides[Math.floor(Math.random()*RLsides.length)];
var RLblock=jsPsych.randomization.repeat([['blue','win'],['blue','lose'],['red','win'],['red','lose'],['green','win'],['green','lose']],1);
blockcount=0


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function drawpoly(c,color,xpos,ypos,size){
  var ctx=c.getContext("2d");
      ctx.fillStyle = color
        var numberOfSides = 8,
        size = size,
        Xcenter = xpos,
        Ycenter = ypos;
        ctx.beginPath();
        ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
        for (var i = 1; i <= numberOfSides; i += 1) 
        {
            ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
        }
        
        ctx.stroke();
        ctx.fill();
    }
    
function show_Amb(c,color,A) {
  var ctx = c.getContext("2d");
  ctx.textAlign = "center"; 
  //ctx.fillText('HERE!',500,250);
  ctx.fill();
  // Colors
  if (color=='red') {
    var colors = ["rgba(255, 0, 0,1)","rgba(255, 0, 0,0.5)" ];
  } else if (color=='green') {
    var colors = ["rgba(0, 255, 0,1)","rgba(0, 255, 0,0.5)" ];
  } else if (color =='blue') {
    var colors = ["rgba(0, 0, 255,1)","rgba(0, 0, 255,0.5)" ];
  }
  
  // List of Angles
  var a_angles = [Math.PI * 0.5*2, Math.PI * 0.5*2];
  // Temporary variables, to store each arc angles
  var beginAngle = Math.PI/2;
  var endAngle = Math.PI/2;
  
  // Iterate through the angles for AMB
  for(var i = 0; i < a_angles.length; i = i + 1) {
    // Begin where we left off
    beginAngle = endAngle;
    // End Angle
    endAngle = endAngle + a_angles[i];
    ctx.beginPath();
    // Fill color
    ctx.fillStyle = colors[i % colors.length];
    // Same code as before
    //ctx.moveTo(200, 200);
    ctx.arc(500, 250, 120, beginAngle, endAngle);
    ctx.lineTo(500, 250);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();}
    
  //Inside Ambiguity Gray Mask
  // Begin where we left off
  beginAngle = (A[0]-.25)*2*Math.PI;
  // End Angle
  endAngle = (A[1]-.25)*2*Math.PI;
  ctx.beginPath();
  // Fill color
  ctx.fillStyle = "grey";
  // Same code as before
  //ctx.moveTo(200, 200);
  ctx.arc(500, 250, 140, beginAngle, endAngle);
  ctx.lineTo(500, 250);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  
  //outside Ambiguity Color circle
  ctx.beginPath();
  ctx.lineWidth=20;
  ctx.strokeStyle='black';
  ctx.arc(500, 250, 160, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.lineWidth = 15;
  ctx.strokeStyle=colors[0];
  ctx.arc(500, 250, 160, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.lineWidth=3;
  ctx.strokeStyle='black';
  ctx.closePath();

  // Text
  ctx.beginPath();
  ctx.fillStyle='black';
  ctx.font = "48px serif";
  ctx.fillText(A[0]*100+'% -'+A[1]*100+'%',
  500, 250+60);
  //ctx.strokeText(pt.toFixed(0)+'%', lottext[0], lotpos[1]f+60)

  //ctx.fillText('+', 500, 250)
  ctx.closePath();
  ctx.stroke();
  
};

function show_win(c,color,A,win){
  show_Amb(c,color,A,win)
  var ctx=c.getContext("2d");
  ctx.textAlign='center';
  
  if (win=='win'){
    pos=[800,250];
    color='rgb(240,240,0,1)';
    dollartext='$7';
    wintext='You won!';
  }
  else if (win == 'lose'){
    pos=[200,250];
    color='gray';
    dollartext='$0';
    wintext='You didn\'t win';
  };
  drawpoly(c,color,pos[0],pos[1],100);
  
  ctx.fillStyle='black';
  ctx.font = "48px serif";
  ctx.fillText(dollartext,pos[0],pos[1]+20);
  ctx.fillText(wintext, 500,475);
  
}; 



var RL_input={
  type:jsPsychCanvasKeyboardResponse,
  canvas_size:[500,1000],
  stimulus: function (c){
    //drawPie(c,0.5,'blue','left',[.25,.75])
    show_Amb(c,RLblock[blockcount][0],RLA)
  },
  choices:[" "],
  prompt:'<p> Press the "SPACE BAR" to see if you\'ve won!</p>'
};

var RL_feedback={
  type:jsPsychCanvasKeyboardResponse,
  canvas_size:[500,1000],
  stimulus:function (c){
    show_win(c,RLblock[blockcount][0],RLA,RLblock[blockcount][1])
  },
  choices:[" "],
  prompt:'<p>Press "SPACE BAR" to make choices about this lottery</p>'
};


var RL_choices = {
      type: jsPsychCanvasKeyboardResponse,
      canvas_size: [500, 1000],
      stimulus: function(c){
        drawAlot(c,
        RLp1,
        RLblock[blockcount][0],
        RLside,
        RLA)},
      data: {
        dist:'norm' ,
        p1:RLp1,
        color:RLblock[blockcount][0],
        RL_feedback:RLblock[blockcount][1],
        side: RLsides,
        tnum:RLTrialNum,
        Amb:RLA,
        Blocktype:'Learning',
      },
      choices: ['f','j'],
      //prompt: '<p> Press "F" for the option on the left and "J" for the option on the Right</p>',
      trial_duration:4500,
    on_finish: function(data){
    data.per=RLp1;
    data.color=RLblock[blockcount][0];
    data.side=RLside;
    data.tnum=RLTrialNum;
    data.Amb=RLA;
    data.RL_feedback=RLblock[blockcount][1];
    if(jsPsych.pluginAPI.compareKeys(data.response, "f")){
      data.select = 'left';
      select='left'; }
    if(jsPsych.pluginAPI.compareKeys(data.response, "j")){
      data.select = 'right'; 
      select='right';}
    if (!(jsPsych.pluginAPI.compareKeys(data.response, "j") || jsPsych.pluginAPI.compareKeys(data.response, "f")))
    {
        data.select='none'
        select='none'
    } 
    if(data.select==data.side){
      RLchoice = 'risk';
      data.choice=RLchoice
      }
      else {
      RLchoice = 'Amb';
      data.choice=RLchoice
     }
     
  }
};
function RLhighlight_select(c,p1,color,pos,A,select){
  var ctx=c.getContext("2d");
   if (select=='none'){
     ctx.font = "48px serif";
     ctx.fillText("Please Choose Quicker",0,200)}
  else {
   if (select=='left'){
    var chosepos=[200,250];
  } else if (select=='right') {
    var chosepos=[800,250];
  }
  var ctx = c.getContext("2d");
  ctx.textAlign = "center";
  //ctx.fillText(pos,500,500)
  drawAlot(c,p1,color,pos,A)
  hoverPath = new Path2D();
  ctx.strokeStyle="rgb(250,155,0)"
  ctx.lineWidth = 15;
  ctx.rect(chosepos[0]-200, chosepos[1]-200, 400, 400);
  ctx.closePath();
  ctx.stroke();}
}

var RLfeedback2 = {
 type: jsPsychCanvasKeyboardResponse,
 canvas_size: [500, 1000],
 stimulus: function(c) {
  
   var last_select= jsPsych.data.get().last(1).values()[0].select;
   var last_side= jsPsych.data.get().last(1).values()[0].side;
   RLhighlight_select(
     c,
     RLp1,
     RLblock[blockcount][0],
     last_side,
     RLA,
     last_select)
   
 },
     choices: "NO_KEYS",
     trial_duration:400
}


function RL_updatep1() {
  RLside=RLsides[Math.floor(Math.random()*RLsides.length)];
  RLchoicehist[RLTrialNum % 2]=RLchoice // Keep track of the last two choices
  if (RLchoicehist[0]==RLchoicehist[1]){ // If the last two choices are the same
    RLstep_size*=1.5;} // Increase the stepsize
  else{ // If they're different
    RLstep_size*=.5;} // decrease the step size
  
  RLTrialNum+=1 // keep track of the trial Number
	if (RLchoice == 'risk') { // if chose risk make less appealing by decreasing the prob to win
		RLp1 -= RLstep_size;
	  RLp1+= 0.01*getRandomInt(-2, 2); // jitter probability by + or - 0.00,0.01,0.02
	  RLp1=Number(RLp1.toFixed(2)); // round to nearest 0.01
	}
	else if (RLchoice == 'Amb') {
	  RLp1+= RLstep_size;
	  RLp1+=0.01*getRandomInt(-3, 3);
	  RLp1=Number(RLp1.toFixed(2));
	}
	  
	if (RLp1>1){ // probability can't be bigger than 100 or lower than 0
		 RLp1=1;}
	if (RLp1<0){
	    RLp1=0;}
};

function RL_block_update() {
  blockcount+=1;
  RLTrialNum=1;
  RLp1=0.50;
  RLstep_size=0.2;
  RLchoicehist=[];
};
		
var RL_staircase_assess = {type: jsPsychCallFunction,func: RL_updatep1 };
var RL_assess_block = {type: jsPsychCallFunction,func: RL_block_update };

var RL_staircase = {timeline: [RL_choices,RLfeedback2,RL_staircase_assess,ITI]};
//main procedure
var RL_stair = {
	timeline: [RL_staircase],
	timeline_variables:[],
	loop_function: function(){
		//if we haev reached the specified total trial amount, exit
		if(RLTrialNum > RLTotalTrials) {
			return false;
		} else {
			return true;
		}
	}
};

var RL = {timeline: [RL_input, RL_feedback,RL_stair,RL_assess_block]};

var RLblock1 = {
	timeline: [RL],
	timeline_variables:[],
	loop_function: function(){
		//if we haev reached the specified total trial amount, exit
		if(blockcount > 5) {
			return false;
		} else {
			return true;
		}
	}
};


/// #########################################################################################
/// ###########################CODE FOR ALL OF THE #########################################3
///########################## QUESTIONAIRES          #####################################3
///#########################################################################################

var likert_scale = [
  "Strongly Disagree", 
  "Disagree", 
  "Neutral", 
  "Agree", 
  "Strongly Agree"
];
/// #########################AQ Code#########################################
const AQ_q = [
"I prefer to do things with others rather than on my own.",
"I prefer to do things the same way over and over again.",
"If I try to imagine something, I find it very easy to create a picture in my mind.",
"I frequently get so strongly absorbed in one thing that I lose sight of other things.",
"I often notice small sounds when others do not.",
"I usually notice car number plates or similar strings of information.",
"Other people frequently tell me that what I've said is impolite, even though I think it is polite.",
"When I'm reading a story, I can easily imagine what the characters might look like.",
"I am fascinated by dates.",
"In a social group, I can easily keep track of several different people's conversations.",
"I find social situations easy.",
"I tend to notice details that others do not.",
"I would rather go to a library than to a party.",
"I find making up stories easy.",
"I find myself drawn more strongly to people than to things.",
"I tend to have very strong interests, which I get upset about if I can't pursue.",
"I enjoy social chitchat.",
"When I talk, it isn't always easy for others to get a word in edgewise.",
"I am fascinated by numbers.",
"When I'm reading a story, I find it difficult to work out the characters' intentions.",
"I don't particularly enjoy reading fiction.",
"I find it hard to make new friends.",
"I notice patterns in things all the time.",
"I would rather go to the theater than to a museum.",
"It does not upset me if my daily routine is disturbed.",
"I frequently find that I don't know how to keep a conversation going.",
"I find it easy to 'read between the lines' when someone is talking to me.",
"I usually concentrate more on the whole picture, rather than on the small details.",
"I am not very good at remembering phone numbers.",
"I don't usually notice small changes in a situation or a person's appearance.",
"I know how to tell if someone listening to me is getting bored.",
"I find it easy to do more than one thing at once.",
"When I talk on the phone, I'm not sure when it's my turn to speak.",
"I enjoy doing things spontaneously.",
"I enjoy doing things alone.",
"I find it easy to work out what someone is thinking or feeling just by looking at their face.",
"If there is an interruption, I can switch back to what I was doing very quickly.",
"I am good at social chitchat.",
"People often tell me that I keep going on and on about the same thing.",
"When I was young, I used to enjoy playing games involving pretending with other children.",
"I like to collect information about categories of things (e.g., types of cars, birds, trains, plants).",
"I find it difficult to imagine what it would be like to be someone else.",
"I like to carefully plan any activities I participate in.",
"I enjoy social occasions.",
"I find it difficult to work out people's intentions.",
"New situations make me anxious.",
"I enjoy meeting new people.",
"I am a good diplomat.",
"I am not very good at remembering people's date of birth.",
"I find it very easy to play games with children that involve pretending."
]
var AQ_questions = [];
for (var i = 0; i < 50; i++) {
  AQ_questions.push({
    prompt: AQ_q[i],
    name: 'AQ' + (i+1),
    labels: likert_scale,
    required: true
  });
}

var AQ = {
  type: jsPsychSurveyLikert,
  questions: AQ_questions,
  randomize_question_order: false,
  prompt:"<p><b>For each statement below, choose one response that best describes how strongly that statement applies to you:</b></p>"
};

///######################### FEVS ###################################3

var FEVS = {
  type: jsPsychSurveyMultiChoice,
  prompt:'<p> Pease Answer the following questions about your personal financial experiences:</p>',
  questions: [
    {prompt: "How worried are you about having enough money to pay for things?", 
      name: 'FEVS_1', 
      options: ['Not at all worried','Somewhat worried','Very Worried'], 
      required: true}, 
    { prompt: "Overall, how satisfied are you with your finances?", 
      name: 'FEVS_2', 
      options: ['Satisfied','Neither','Dissatisfied'], 
      required: true},
    { prompt: "Think about who manages your finances day-to-day? How satisfied are you with this money management arrangement?", 
      name: 'FEVS_3', 
      options:  ['Satisfied','Neither','Dissatisfied'], 
      required: true },
    {prompt: "How confident are you in making big financial decisions?", 
      name: 'FEVS_4', 
      options: ['Confident','Unsure','Not Confident'], 
      required: true},
    {prompt: "How often do you worry about financial decisions you've recently made?", 
      name: 'FEVS_5', 
      options: ['Never','Sometimes','Often'], 
      required: true},
    {prompt: "How often do your monthly expenses exceed your regular monthly income?", 
      name: 'FEVS_6', 
      options: ['Never or rarely','Some of the time','A lot of the time'], 
      required: true},
    {prompt: "How often do you wish you had someone to talk to about financial decisions, transactions, or plans?", 
      name: 'FEVS_7', 
      options: ['None of the time','Some of the time','A lot of the time'], 
      required: true},
    {prompt: "How often do you feel anxious about your financial decisions and/or transactions?", 
      name: 'FEVS_8', 
      options: ['Never or rarely','Sometimes','Often'], 
      required: true},
    {prompt: "How often do you feel downhearted or blue about your financial situation or decisions?", 
      name: 'FEVS_9', 
      options: ['None of the time','Some of the time','Most if the time'], 
      required: true},
  ],
};

///######################### USI_dep ###################################3
var USIDep_options=['Yes','No'];
const USIDep_q=[  "In the last 12 months have you personally been forced to buy cheaper food so that you could pay for other things you needed?",
"In the last 12 months did you yourself receive payments from any of these benefit programs: Temporary Assistance to Needy Families (TANF), Earned Income Tax Credit (EITC), or a Housing Assistance program, (e.g.,Section 8 Housing voucher)?",
"In the last 12 months have you personally put up with feeling cold in order to save on heating costs?",
"In the last 12 months have you personally made use of food banks or government food programs because you did not have enough money for food? For example, did you get benefits from the Supplemental Nutrition Assistance Program (SNAP/EBT/Food stamps), or the Women, Infants and Children (WIC) food programs?",
"In the last 12 months have you personally continued wearing shoes with holes because you could not afford replacement?",
"In the last 12 months have you personally gone without fresh fruit and vegetables, often, so that you could pay for other things you needed?",
"In the last 12 months have you personally received help in the form of clothes or money from a community organization (like a religious group or the Salvation Army)?"];

var USIDep_questions = [];

for (var i = 0; i < USIDep_q.length; i++) {
  USIDep_questions.push({
    prompt: USIDep_q[i],
    name: 'USIDep' + (i+1),
    options: USIDep_options,
    horizontal:false,
    required: true
  });
}

USIDep_questions.push({
  prompt:"If you are less than 65 years old: In the last 12 months, have you been out of paid work at any time for more than one month?",
  name: 'USIDep8',
  options:['Yes','No','I am more than 65 years old'],
  required:true
});

var USIDEP = {
  type: jsPsychSurveyMultiChoice,
  questions: USIDep_questions,
  randomize_question_order: false,
  prompt:
  "<p align='center'> <b> The following few questions are designed to help us understand people who have had special financial needs in the last <u>12 months</u>.<br>"+
  "These questions are for <u>you personally</u>"
};


///######################### 7u7d CODE###################################3

const SUSD_q = [
  "Have you had periods of extreme happiness and intense energy lasting several days or more when you also felt much more anxious or tense (jittery, nervous. uptight) than usual (other than related to the menstrual cycle)?",
  "Have there been times of several days or more when you were so sad that it was quite painful or you felt that you couldn't stand it?",
  "Have there been times lasting several days or more when you felt you must have lots of excitement, and you actually did a lot of new or different things?",
  "Have you had periods of extreme happiness and intense energy (clearly more than your usual self) when, for several days or more, it took you over an hour to get to sleep at night?",
  "Have there been long periods in your life when you felt sad, depressed, or irritable most of the time?",
  "Have you had periods of extreme happiness and high energy lasting several days or more when what you saw, heard, smelled, tasted, or touched seemed vivid or intense?",
  "Have there been periods of several days or more when your thinking was so clear and quick that it was much better than most other people's?",
  "Have there been times of a couple days or more when you felt that you were a very important person or that your abilities or talents were better than most other people's?",
  "Have them been times when you have hated yourself or felt that you were stupid, ugly, unlovable, or useless?",
  "Have there been times of several days or more when you really got down on yourself and felt worthless?",
  "Have you had periods when it seemed that the future was hopeless and things could not improve?",
  "Have there been periods lasting several days or more when you were so down in the dumps that you thought you might never snap out of it?",
  "Have you had times when your thoughts and ideas came so fast that you couldn't get them all out, or they came so quickly that others complained that they couldn't keep up with your ideas?",
  "Have there been times when you have felt that you would be better off dead?"
];
var SUSD_questions = [];
for (var i = 0; i < SUSD_q.length; i++) {
  SUSD_questions.push({
    prompt: SUSD_q[i],
    name: 'SUSD' + (i+1),
    options:['Never or hardly ever','Sometimes','Often','Very often or almost constantly'],
    required: true
  });
}

var SUSD = {
  type:jsPsychSurveyMultiChoice ,
  questions: SUSD_questions,
  randomize_question_order: false,
  horizontal:true,
  preamble:
  "<p align='center'> <b>Below are some questions about behaviors that occur in the general population."+
  "<br>Using the scale below, select the number that best describes how often you experience these behaviors.</p> </b>"
};


///######################### AADIS (ACTUALLY JUST DRUG USE HISTORY) CODE###################################3

var AADIS_options=['Never Used',
'Once or Twice',
'Several Times a Month',
'Weekends Only',
'Several Times a Week',
'Daily',
'Several Times Daily'];

const AADIS_q = [
  "Tobacco(cigarettes, cigars), chewing tobacco, nicotine gum or nicotine patch",
  "Alcohol (beer, wine, liquor)",
  "Marijuana or Hashish (pot, weed, grass, blunts, wet)",
  "LSD, mushrooms, peyote, mescaline or other hallucinogens (acid, shrooms, Special K)",
  "Amphetamines (speed, ecstasy, uppers,  crystal meth, Ice, Tina), or ritalin, concerta, or adderall without a prescription",
  "Powder Cocaine (coke, blow)",
  "Rock Cocaine (crack, rock, freebase)",
  "Barbiturates (quaaludes, downers, ludes, blues, goofballs)",
  "PCP (angel dust)",
  "Heroin or other opiates (opium, morphine, oxycontin, codeine, smack, horse, cheese)",
  "Inhalants (glue, gasoline, spray cans, paint, nitrous oxide, whippits, ether, chloroform, whiteout, rush, etc.)",
  "Valium, xanax (xandies), ativan, benzos, GHB (ruffies) or other tranquilizers without a prescription"
  ];
  
var AADIS_questions = [];

for (var i = 0; i < AADIS_q.length; i++) {
  AADIS_questions.push({
    prompt: AADIS_q[i],
    name: 'AADIS' + (i+1),
    options:AADIS_options,
  });
}

var AADIS = {
  type: jsPsychSurveyMultiChoice,
  questions: AADIS_questions,
  randomize_question_order: false,
  preamble:
  "<p align='center'> <b>For each drug or class of drugs please indicate if you've ever tried it ir how often you typically use it. <br> Consider only drugs taken without prescription from your doctor; <br> for alcohol, don't count just a few sips from someone else's drink.</b></p>"
};


/////#################3 SUBJECTIVE FRAUD QUESTIONAIRE #########################

var SFQ = {
  type: jsPsychSurvey,
  button_label_finish:'Continue',
  pages: [
    [
      {type: 'html',
        prompt: '<p align="center"> <b> Please answer the following questions:</b></p>',},
      { type: 'multi-choice',
        prompt: " Have you ever been the victim of a scam or financial exploitation?", 
        name: 'SFQ1', 
        options: ['Yes','No'], 
        required: true}, 
      { type: 'text',
        prompt: "If yes, Approximately how much money (in dollars) did you lose as a result of fraud or financial exploitation in your lifetime? ", 
        name: 'SFQ2', 
        required: false},
      { type: 'text',
        prompt: "If yes, Approximately when did the scam or financial exploitation occur? ", 
        name: 'SFQ3', 
        required: false},
      { type: 'multi-choice',
        prompt: " How would you categorize the scam or financial exploitation that occur??", 
        name: 'SFQ4', 
        options: ['An impersonator (fake government, business, love interest, grandchild, etc)',
        'Job, investment, or money making opportunity',
        'Phone, internet, TV service',
        'Health (weight loss, other treatments)',
        'Online shopping',
        'Sweepstakes, prize, lottery',
        'Auto sale or repair',
        'Credit, debt, or loan',
        'Other not described'], 
        required: false},
      { type: 'text',
        prompt: "Can you describe the event and what happened? ", 
        name: 'SFQ5', 
        required: false},
      { type: 'text',
        prompt: "How much money have you lost in your lifetime as a result of fraud, financial exploitation, or related scams? ", 
        name: 'SFQ6', 
        required: true},
      { type: 'text',
        prompt: "How much money have you lost in the past 12 months as a result of fraud, financial exploitation, or related scams? ", 
        name: 'SFQ7', 
        required: true}
      
    ]
  ],
};
//###########################################################################
//############       Demographics               ############################
//############################################################################
var Demographics = {
  type: jsPsychSurvey,
  button_label_finish:'Continue',
  pages:[[
      {type: 'html',
        prompt: "<p><b> Please answer the following demographics questions:</b></p>"
      },
      { type: 'text',
        prompt: " What is your age in years?", 
        name: 'age',
        required: true

      }, 
     { type: 'multi-choice',
        prompt: " What is your sex?", 
        name: 'sex', 
        options: ['Male','Female','Other'], 
        required: true
       
     },
      { type: 'text',
        prompt: "If Other, please elaborate", 
        name: 'sexOther',
        required: false
        
      },
      { type: 'multi-choice',
        prompt: "Which race or ethicity best describes you? (Please choose only one.)", 
        name: 'race', 
        options: ['Native American or Alaskan Native','Asian / Pacific Islander','Black or African American',
        ' Hispanic','White / Caucasian',"Multiple ethnicity/ Other (please specify)"], 
        required: true
        
      },
        { type: 'text',
        prompt: "If Other, please elaborate", 
        name: 'raceOther',
        required: false
          
        },
      { type: 'multi-choice',
        prompt: "What is your highest level of education?", 
        name: 'education', 
        options: ['No schooling completed','Some high school, no diploma','High school graduate, diploma or the equivalent',
        'Some college credit, no degree','Associates Degree',"Bachelor's Degree","Master's Degree","Doctoral Degree"], 
        required: true},
        
        { type: 'text',
        prompt: "What is the zip code of your current residence?", 
        name: 'Zip1',
        required: true
          
        },
        { type: 'text',
        prompt: "If you have moved in the past 5 years, which zip code did you spend most of your time?", 
        name: 'Zip5',
        required: false
        }
    ]]
};

//###########################
// consent
//###############################
var check_consent = function(elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
        return false;
    }
    return false;
};
var InformedConsent = {
    type: jsPsychExternalHtml,
    url: "external_page.html",
    cont_btn: "start",
    check_fn: check_consent
};

/// #########################################################################################
/// ###########################CODE FOR ALL OF THE #########################################3
///########################## BONUS REVEAL          #####################################3
///#########################################################################################
function drawBonus(c,Bonus_select,Bonus_p1,Bonus_val){
  var total_response=jsPsych.data.get().select('rt').subset(function(x){ return x > 0; }).count();
  
  var ctx=c.getContext("2d");
  var bonusper=Bonus_p1*100;
  ctx.beginPath()
  ctx.fillStyle='black'
  ctx.font = "26px serif";
  if (total_response<220){
    ctx.fillText("You missed too many trials your submission is being",100,100)
    ctx.fillText("rejected you can appeal if you think this was a mistake",100,150)
    Bonus_val='reject'
  }
  else{
  ctx.fillText("For Your Bonus you chose the "+Bonus_select+" option",100,100)
  ctx.fillText("Your choice was between a safe $3 and a "+bonusper.toFixed(0)+"% chance at $7", 10, 300)
  ctx.fillText("After running the gamble your bonus will be "+Bonus_val, 50, 400)
  }
  if (Bonus_val=='$0'){
    Prolink='https://app.prolific.co/submissions/complete?cc=C1ISGV6W'
  }
  if (Bonus_val=='$3'){
    Prolink='https://app.prolific.co/submissions/complete?cc=CJ5RNK30'
  }
  if (Bonus_val=='$7'){
    Prolink='https://app.prolific.co/submissions/complete?cc=C3E2LD8X'
  }
  if (Bonus_val=='reject'){
    Prolink='https://app.prolific.co/submissions/complete?cc=CCXX2CJH'
  }
}

var Bonus_reveal = {
  type: jsPsychCanvasKeyboardResponse,
  stimulus:function(c){ drawBonus(c,Bonus_select,Bonus_p1,Bonus_val) },
  canvas_size:[500,1000],
  choices: " ",
  trial_duration:5000,
  on_finish:function(data){  
    data.Bonus_select=Bonus_select;
    data.BonusPer=Bonus_p1;
    data.BonusVal=Bonus_val;
    data.BonusLink=Prolink;
    data.TaskResponseCount=jsPsych.data.get().select('rt').subset(function(x){ return x > 0; }).count();
  }
}

var final_trial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:function(data){
  Prolink= jsPsych.data.get().last(1).values()[0].BonusLink;
  return "<p>You've finished the last task. Thanks for participating!</p>"+"<p><a href="+Prolink+">Click here to return to Prolific and complete the study</a>.</p>"},
  choices: "NO_KEYS",
  trial_duration:5000,
  on_finish:function(data){  
    Prolink= jsPsych.data.get().last(2).values()[0].BonusLink;
    window.location = Prolink}
};

var endQuests={
  timeline: [Demographics,AQ,FEVS,USIDEP,SUSD,AADIS,SFQ],
  randomize_order: false
}

timeline.push(Demographics)
//timeline.push(mem_quest)
//timeline.push(
//  InformedConsent,preload,Risk_instruct,Rblock1,Rblock2,Rblock3,
//  mem_quest,Aisk_instruct,Ablock1,RL_instruct,RLblock1,
//  Demographics,AQ,FEVS,USIDEP,SUSD,AADIS,SFQ)

timeline.push(Bonus_reveal)

timeline.push(final_trial)

    /* start the experiment */
jsPsych.run(timeline);//  InformedConsent,preload,Risk_instruct,Rblock1,Rblock2,Rblock3,  return "<p> You have completed the experiment</p></br><p> Thank you for your time!</p> <p>Please click the following <a href = "+
