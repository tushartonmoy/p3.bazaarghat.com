/*  SETTING PARAMS */
var START_TIME = 9; //0900 hours
var TIME_GAP = 10; // in minutes , between two movies
var COMMON_RUNTIME = 120; // in minutes

var selectedMovies = [];
var schedule = [];

$(document).ready(function(){
    
    var txt="";
    var i = 0;
    for(var i=0;i<movies.length;i++) {
        var x=movies[i];
        txt+="<div class='movie clearfix' id='"+x.title+"' rel='"+i+"'>";
        txt+="  <div class='checkbox'></div>";
        txt+="  <img class='poster' src='"+encodeURI(x.posterURL)+"'/>";
        txt+="  <div class='movieInfo'>";
        txt+="      <div class='movieTitle'>"+x.title+"</div>";
        txt+="      <div class='movieLanguage'>"+x.lang+"</div>";
        txt+="      <div class='movieRunTime'>"+COMMON_RUNTIME+" min</div>";
        txt+="      <div class='movieMeta'>";
        txt+="<strong>Screen : </strong>"+(getScreenForMovie(i)+1)+"<br>";
        txt+="<strong>Time :</strong>"+getTime(i)+"<br><br>";
        for(var y in x.meta){
            txt+="<strong>"+y+" :</strong> "+x.meta[y]+"<br>";
        }
        
        txt+="      </div>";
        txt+="  </div>";
        txt+="</div>";        
        
    }
    $("#movies").html(txt);
    $("#status").html(selectedMovies.length+" / "+movies.length);
    
    
    $(".movie").click(function(){
        if($(this).hasClass("selected")) {
            //remove
            var index = selectedMovies.indexOf(parseInt($(this).attr("rel")));
            if(index>-1) 
                selectedMovies.splice(index,1);
        } else {
            //add
            selectedMovies.push(parseInt($(this).attr("rel")));
        }
        
        $(this).find(".checkbox").toggleClass("on");
        $(this).toggleClass("selected");
        $("#status").html(selectedMovies.length+" / "+movies.length);
    });
    
    $(".getBtn").click(function(){
        backup = selectedMovies.slice(0);
        
        if(backup.length>0){
            schedule=[];
            try {
                
                var t1=Date.today().add({hours:START_TIME});
                var t2=new Date();
                var diff=(t2.getTime()-t1.getTime())/(1000*60);
                var numSlotsLost = Math.ceil(diff/(COMMON_RUNTIME+TIME_GAP));
                for(var z=0;z<(numSlotsLost);z++) {
                    schedule.push(-1);
                }
                
                while(schedule.length>6) {
                    schedule.pop();
                }
            }catch(e) {
                alert(e);
            }
            
            while(backup.length>0){
                index = schedule.length%6;                    
                var temp = -1;
                for(var i=0;i<backup.length;i++) {
                    var screen = getScreenForMovie(backup[i]);
                    if(screenSchedules[screen][index]===backup[i]) {
                        temp = backup[i];
                        backup.splice(i,1);
                        break;
                    }                        
                }
                schedule.push(temp);
                
                
                
            }
            
            $("#schedule").fadeOut(300,function(){
                var txt="<div class='sched_head'>Generated Schedule : </div>";
                txt+="<table id='sched_table' cellpadding='0' cellspacing='0' width='100%'>";
                txt+="<tr><th>Time</th><th>Movie</th><th>Screen No</th></tr>";
                for(var i = 0;i<schedule.length;i++) {
                    if(schedule[i]>-1) {
                        
                        txt+="<tr class='sched_m'>";
                        
                        var temp=0;
                        for(var j=0;j<i;j++){
                            
                                temp+=COMMON_RUNTIME + TIME_GAP;
                                if(j%5==0 && j!=0){
                                    temp += 11*60;
                                    
                                }                        
                        }
                        
                        var _t = Date.today().add({
                            minutes     : temp,
                            hours       : START_TIME
                        });
                        txt+="  <td class='sched_time' >"+_t.toString("ddd d/MM/yy,<br> hh:mm tt")+" - "+_t.add({minutes:COMMON_RUNTIME}).toString("hh:mm tt")+"</td>";
                        txt+="  <td class='sched_right' >";
                        txt+="      <div class='sched_title'>"+movies[schedule[i]].title+"</div>";
                        txt+="  </td>";
                        txt+="  <td class='screen_no'>"+(getScreenForMovie(schedule[i])+1)+"</td>";
                        txt+="</tr>";
                        
                    }
                }
                txt+="</table>";
                $("#schedule").html(txt).fadeIn(300);
            });
            
            
            
            
            //alert(JSON.stringify(schedule,undefined,1));
        } else {
            // no op
            //alert("selectedMovies empty");
        }
    });// end getBtn.click
    
    $(".clr").click(function(){
        $(".movie.selected").removeClass("selected");
        $(".checkbox.on").removeClass("on");
        $("#status").html("0 / "+movies.length);
        $("#schedule").html("");
        selectedMovies=[];
        schedule=[];
    });
    
    $(".selectAll").click(function(){
        $("#movies").find("div.checkbox").each(function(){$(this).click()});
            
    });
    
    
});
function getTime(movie){
    try {
        var screen = getScreenForMovie(movie);
        var index=[];
        index[0]=screenSchedules[screen].indexOf(movie);
        index[1]=index[0]+3;
        var t=Date.today();
        var txt=" " + t.add({minutes:(START_TIME*60)+((index[0])*(COMMON_RUNTIME+TIME_GAP))}).toString("hh:mm tt")+" , ";
        t = new Date.today();
        txt+=t.add({minutes:(START_TIME*60)+((index[1])*(COMMON_RUNTIME+TIME_GAP))}).toString("hh:mm tt");
        return txt;
    }
    catch(e) {
        //alert(e);
        return null;
    }
}

function getScreenForMovie(id) {
    return Math.floor(id/3);
}