(function(){var EMOS_VERSION="cm46b_heine";var URL_TRACKING_ALLOWED=false;var SITE_ID="0";var MANDANT=false;var LOG_URL=(location.protocol=="https:")?"https://www.econda-monitor.de/els/logging":"http://www.econda-monitor.de/els/logging";var STORAGE_MAX=10;var COOKIES_MAX=10;var JUNK_SIZE=1600;var CLIENT_COOKIE_LIFETIME=2592000;var COOKIENAME_SESSION_ID="emos_jcsid";var COOKIENAME_VISITOR_ID="emos_jcvid";var COOKIENAME_CAMPAIGN="emos_jckamp";var ay="emos_clickin";var COOKIENAME_CROSS="emos_jccross";var COOKIE_DOMAIN=null;var TRACK_FIRSTPARTY=true;var TRACK_POSTCONVERSION=true;var EVENT_MILLIS=200;var sendSecondary=false;var carriesSecondaryCookie=false;var acc=null;var CLIENT_KEY="00000cfd-939bf671-e28f-4da6-90d4-f39f088faba1";var SECOND_ACCOUNT=null;var SECOND_CLIENT_KEY=null;var FIRST_ACTIVE=true;var SECOND_ACTIVE=false;var SECOND_SUMA=false;var TRACK_THIRD_PARTY=false;var USE_SYSTEM_SID=false;var SAMPLING_RATE=10;var BEST_PRODUCTS_COOKIE=false;var PRODUCT_ID_IN_EC_EVENT=1;var COOKIENAME_BEST_PRODUCTS="emos_best_products";var BEST_PRODUCTS_COOKIE_LIFETIME=2592000;var TRACK_VERSION=2;var SAMPLING_MODE_CLICKONLY=true;var CAPTURE_CLICKS=(window.emosTrackClicks)?window.emosTrackClicks:true;var ATTRIBUTES_TRACKED=["id","name","title","alt","class"];if(URL_TRACKING_ALLOWED){ATTRIBUTES_TRACKED=ATTRIBUTES_TRACKED.concat(["href","src"])}var ELEMENTID_BY_TAGNAME_PARENTDEPTH=2;var ELEMENTID_BY_TAGNAME_USE_PARENTPOS=true;var ATTRIBUTES_MAX_LENGTH=128;var COOKIENAME_CLICKMONITOR="emos_clickmonitor";var URL_CLICKMONITOR="https://monitor.econda-monitor.de/click";var K;var aq=function(){if(window.emosPageId){K=window.emosPageId.substring(0,254);return}var aS=document.getElementsByTagName("meta");for(var aR=0;aR<aS.length;aR++){if(aS[aR].getAttribute("name")=="DC.identifier"){K=aS[aR].getAttribute("content").substring(0,254);return}}if(URL_TRACKING_ALLOWED){var e=(window.clickmonitor)?window.clickmonitor.location:window.location;K=e.protocol+"//"+e.host+e.pathname;K=K.substring(0,254)}};var ax=0;var B=null;var au=0;var av=1;var F=0;var g=1;var M;var h;var al=0;var s;var b;var aC=null;var S=null;var am=[];var L=true;var aQ=false;var j=false;try{if(window.sessionStorage&&window.sessionStorage.length>=0){j=true}}catch(W){}var R=true;var aB;var H;var n=function(){if(window.emos_kdnr){CLIENT_KEY=null;var e=window.emos_kdnr-723;if(e%673==0){acc=e/673}else{acc=1012}}};var z=(window.encodeURIComponent)?window.encodeURIComponent:window.escape;var aw=function(aR){try{if(window.decodeURIComponent){try{return window.decodeURIComponent(aR.replace(/\+/g,"%20"))}catch(aT){return window.unescape(aR)}}else{return window.unescape(aR)}}catch(aS){return aR}};var aM=function(aT,aS,aR){if(aT.addEventListener){aT.addEventListener(aS,aR,true)}else{if(aT.attachEvent){aT.attachEvent("on"+aS,aR)}else{var e=aT["on"+aS];if(!e){aT["on"+aS]=aR}else{aT["on"+aS]=function(aU){aR(aU);e(aU)}}}}};var ao=function(e,aV){var aT=Math.floor(e.length/JUNK_SIZE)+1;var aU=[];for(var aR=0;aR<aT;aR++){aU[aR]={};aU[aR].v="2";aU[aR].emrid=aV;if(TRACK_FIRSTPARTY==true){aU[aR].emsid=au;aU[aR].emvid=F}if(TRACK_THIRD_PARTY&&TRACK_POSTCONVERSION){var aS=ab(aC);if(aS.length>0){aU[aR].emcl=CLIENT_COOKIE_LIFETIME;aU[aR].emcc=aS}if(MANDANT){aU[aR].emcm=SITE_ID}}aU[aR].emnc=aT;aU[aR].emtn=aR+1;aU[aR].emhost=location.hostname;if(FIRST_ACTIVE){if(CLIENT_KEY){aU[aR].ckey=CLIENT_KEY}else{aU[aR].emkd=acc}if(SECOND_ACTIVE&&sendSecondary){if(SECOND_CLIENT_KEY){aU[aR].skey=SECOND_CLIENT_KEY}else{aU[aR].emsc=SECOND_ACCOUNT}}}else{if(SECOND_ACTIVE&&sendSecondary){if(CLIENT_KEY){aU[aR].ckey=SECOND_CLIENT_KEY}else{aU[aR].emkd=SECOND_ACCOUNT}}}if(TRACK_THIRD_PARTY){aU[aR].tpct=1}aU[aR].d=e.substr(aR*JUNK_SIZE,JUNK_SIZE)}return aU};var G=function(){var e={};m(e);X(e,0)};var m=function(e){o(e);if(window.emosBillingPageArray){w(window.emosBillingPageArray,e)}if(window.emosECPageArray){T(window.emosECPageArray,e)}V(e);if(window.emosBasketPageArray){aa(window.emosBasketPageArray,e)}E(e)};var d=function(aV){if(!BEST_PRODUCTS_COOKIE){return}if(!aV.ec_Event){return}if(aV.ec_Event.length==0){return}var e=[];for(var aU=0;aU<aV.ec_Event.length;aU++){if(aV.ec_Event[aU].length>PRODUCT_ID_IN_EC_EVENT){e[e.length]=aV.ec_Event[aU][PRODUCT_ID_IN_EC_EVENT]}}if(e.length==0){return}var aR=ag();var aS=[];for(var aU=0;aU<Math.min(e.length,5);aU++){aS[aU]=e[e.length-aU-1]}for(var aU=e.length;aU<Math.min(e.length+aR.length,5);aU++){aS[aU]=aR[aU-e.length]}var aT="";for(var aU=0;aU<aS.length;aU++){if(aU!=0){aT=aT+":"}aT=aT+z(aS[aU])}aG(COOKIENAME_BEST_PRODUCTS,aT,BEST_PRODUCTS_COOKIE_LIFETIME)};var ag=function(){var e=[];var aS=ae(COOKIENAME_BEST_PRODUCTS);if(aS&&aS.length>0){var aT=aS.split(":");for(var aR=0;aR<aT.length;aR++){e[e.length]=aw(aT[aR])}}return e};var o=function(e){e.siteid=SITE_ID;if(window.emosGlobalProperties){Z(e,window.emosGlobalProperties)}ar(e);aF(e);aD(e);if(TRACK_VERSION==1){aH(e)}if(!e.content){e.content="HTML-Title/"+document.title}};var ar=function(aT){aT.host=location.host.substring(0,63);if(URL_TRACKING_ALLOWED){aT.url=location.pathname.substring(0,254)}var aR="NULL";var aS="NULL";try{aR=top.document.referrer}catch(aU){aR=document.referrer}try{aS=ah(aR);aR=c(aR,3)}catch(aU){}aT.ref=aR;if(aS!="NULL"){aT.refUrl=aS}aT.jv=navigator.javaEnabled()?1:0;aT.swsh=screen.width+"x"+screen.height;aT.emosV=EMOS_VERSION};var ah=function(aU){var aR="NULL";try{var aT=f(aU,false);if(aT.url){aR=aw(aT.url)}}catch(aS){}aR=aR.substring(0,127);return aR};var c=function(aU,aT){try{if(aU==null||aU.length==0){return"http://unknown"}if(aU.substr(0,4)!="http"){aU="http://"+aU}if(aT>=0){var aS=aU.split("/");if(aS.length<aT){aT=aS.length}aU="";for(var aR=0;aR<aT;aR++){if(aR!=0){aU=aU+"/"}aU=aU+aS[aR]}}}catch(e){}return aU.substring(0,127)};var aP=function(aR){var aS=(typeof(emos_secondary)!="undefined")?true:false;var e=(aR.billing)?true:false;if(aS){aR.secLabel=emos_secondary}if(e){aS=true}if(TRACK_FIRSTPARTY&&!TRACK_THIRD_PARTY&&!carriesSecondaryCookie){aS=false}return aS};var aO=function(a2){if(!K){return}if(!R){return}if(!B){return}if(!a2){a2=window.event}var aZ={};if((a2.which&&a2.which!=1)||(!a2.which&&a2.button!=1)){return}var a5=a2.pageX;var aS=a2.pageY;var a7=document.documentElement&&document.documentElement.clientHeight!=0?document.documentElement:document.body;if(isNaN(a5)||isNaN(aS)){a5=a2.clientX+((isNaN(window.pageXOffset)?a7.scrollLeft:window.pageXOffset));aS=a2.clientY+((isNaN(window.pageYOffset)?a7.scrollTop:window.pageYOffset))}var aR=a2.target?a2.target:a2.srcElement;var a6=aR.nodeName.toLowerCase();if(a6=="base"){return}while(aR!=null&&aR.nodeType!=1){aR=aR.parentNode}if(a6=="map"){aR=i(aR,a5,aS)}else{if(a6=="area"){aR=i(aR.parentNode,a5,aS)}}if(aR==document.body){aR=document.body.parentNode}var aY=new Date().getTime();var aT=Math.floor((aY-H)/1000);var aV=Math.floor((aY-s)/1000);H=aY;if(document.documentElement==aR||P(document.documentElement,"body")==aR){var a4,a3;if(window.innerHeight){a4=window.innerWidth-17;a3=window.innerHeight-17}else{a4=a7.clientWidth;a3=a7.clientHeight}if(a4<a2.clientX||a3<a2.clientY){return}}var aU=u(aR);var aW=aJ(aU);if(!aW){return}var e=a5-aW[0];var a0=aS-aW[1];var aX=aB++;var a1=ai(aR);aZ.click=[[a5,aS,aV,e,a0,aX,aT,a1,SAMPLING_RATE]];aZ.plReqId=B;t(aZ,k(),0)};var i=function(aU,e,aR){var aW="#"+aU.getAttribute("name");var aX=document.getElementsByTagName("img");for(var aT=0;aT<aX.length;aT++){var aS=aX[aT];if(aS.getAttribute("usemap")==aW){var aV=aJ(aS);if(aV){if(e>=aV[0]&&aR>=aV[1]&&e<=aV[0]+aS.clientWidth&&aR<=aV[1]+aS.clientHeight){return aS}}}}return document.body.parentNode};var u=function(aS){if(aS.nodeName.toLowerCase()!="a"){return aS}var aT=aS.childNodes;var e=null;for(var aR=0;aR<aT.length;aR++){if(aT[aR].nodeType==1){if(e){return aS}else{e=aT[aR]}}if(aT[aR].nodeType==3){if(aT[aR].nodeValue.replace(/^[\s\xA0]+/,"").replace(/[\s\xA0]+$/,"").length>0){return aS}}}if(e==null){return aS}if(aJ(e)){return e}else{return aS}};var X=function(aV,aS){if(aV.pageId){K=aV.pageId}else{if(K){aV.pageId=K}}try{if(K&&top.ClickwatcherAccess){top.ClickwatcherAccess.setPageId(K);L=false;R=false;return}}catch(aY){}var aU=location.search.indexOf("clickmonitor=econda")>=0;if(aU){aG(COOKIENAME_CLICKMONITOR,"true")}if(aU||ae(COOKIENAME_CLICKMONITOR)=="true"){var aR=document.getElementsByTagName("head")[0];if(!aR){var aX=document.documentElement;aR=document.createElement("head");aX.insertBefore(aR,aX.firstChild)}window.emosClickmonitor={pageId:K,cookieName:COOKIENAME_CLICKMONITOR,urlClickmonitor:URL_CLICKMONITOR};var aT=document.createElement("script");aT.setAttribute("type","text/javascript");aT.setAttribute("src",URL_CLICKMONITOR+"/scripts/click.js");aR.appendChild(aT);L=false;R=false;return}s=new Date().getTime();B=k();H=s;aB=0;aE(aV);if(!L){return}d(aV);if(SECOND_ACTIVE){var aW=aP(aV);if(sendSecondary||aW){sendSecondary=true}}t(aV,B,aS)};var t=function(aT,aU,e){if(window.console&&window.console.log&&location.search.indexOf("emosdebug=yxcvbnm")>=0&&window.JSON&&window.JSON.stringify){window.console.log(window.JSON.stringify(aT,null," "))}if(FIRST_ACTIVE||(SECOND_ACTIVE&&sendSecondary)){var aS=ao(l(aT),aU);for(var aR=0;aR<aS.length;aR++){ax=ax+1;a(aS[aR],ax,e)}}};var aJ=function(e){if(e.offsetParent!=null){var aS=aJ(e.offsetParent);if(!aS){return null}aS[0]+=e.offsetLeft;aS[1]+=e.offsetTop;return aS}else{var aR=e.nodeName.toLowerCase();if(aR=="html"||aR=="body"){return[0,0]}else{return null}}};var P=function(aR,e){for(var aS=aR.firstChild;aS!=null;aS=aS.nextSibling){if(aS.nodeName.toLowerCase()==e){return aS}}return null};var a=function(aU,aW,aS){var aV=ab(aU);var aR=new Image();am[aW]=aR;if(j){try{if(window.sessionStorage.length<STORAGE_MAX){window.sessionStorage.setItem("emosTransmit"+aW,aV);aR.onload=function(){window.sessionStorage.removeItem("emosTransmit"+aW);am[aW]=null}}else{aR.onload=function(){am[aW]=null}}}catch(aX){}}else{if(document.cookie.split(";").length<COOKIES_MAX){aG("emosTransmit"+aW,aV);aR.onload=function(){N("emosTransmit"+aW);am[aW]=null}}else{aR.onload=function(){am[aW]=null}}}aR.src=LOG_URL+"?"+aV;var aT=new Date().getTime()+aS;while(new Date().getTime()<aT){}};var ab=function(aR){var aS="";for(var aT in aR){var e=typeof aR[aT];if(e=="string"||e=="boolean"||e=="number"){if(aS!=""){aS+="&"}aS+=aT+"="+z(aR[aT])}}return aS};var az=function(aT){var aU=aT.split("&");var aR={};for(var e=0;e<aU.length;e++){var aS=aU[e].split("=");aR[aS[0]]=aw(aS[1])}return aR};var l=function(e){var aR=[];for(var aS in e){if(aR.length!=0){aR[aR.length]=28}aR=aR.concat(C(aS),[31],aI(e[aS]))}return af(aR)};var aI=function(aV){if(aV==null){return C("NULL")}if(typeof aV=="string"){return C(aV)}if(typeof aV=="number"||aV=="boolean"){return C(""+aV)}if(typeof aV=="object"&&typeof aV.length!="undefined"){var aU=[];for(var e=0;e<aV.length;e++){var aT=aV[e];var aS=false;var aR=(typeof aT=="object"&&typeof aT.length!="undefined");if(e!=0){aU[aU.length]=(aR||aS)?29:30}aU=aU.concat(aI(aT));aS=aR}return aU}return[]};var Q=function(aR){if(!aR.nodeValue||aR.nodeValue.length==0){return false}for(var e=0;e<ATTRIBUTES_TRACKED.length;e++){if(aR.nodeName.toLowerCase()==ATTRIBUTES_TRACKED[e]){return true}}return false};var y=function(aR,e){return J(aR)-J(e)};var J=function(aR){for(var e=0;e<ATTRIBUTES_TRACKED.length;e++){if(aR==ATTRIBUTES_TRACKED[e]){return e}}throw"This should not happen -> attribute not found in ATTRIBUTES_TRACKED"};var x=function(e,aR){if(aR=="href"){return e.getAttribute("href",2)}else{if(aR=="src"){return e.getAttribute("src",2)}else{if(aR=="class"){return e.className}}}return e.getAttribute(aR)};var ai=function(aX){var e=[];I(aX,ELEMENTID_BY_TAGNAME_PARENTDEPTH,e);var aT=[];for(var aW=0;aW<aX.attributes.length;aW++){if(Q(aX.attributes[aW])){aT[aT.length]=aX.attributes[aW].nodeName.toLowerCase()}}aT.sort(y);var aS=0;for(var aW=0;aW<aT.length;aW++){var aV=x(aX,aT[aW]);aS+=aV.length;if(aS>ATTRIBUTES_MAX_LENGTH){break}e[0].attributes[aT[aW]]=""+aV}var aU=document.getElementsByTagName(e[0].nodeName);var aR=0;for(var aW=0;aW<aU.length;aW++){if(q(aU[aW],e,0)){if(aX==aU[aW]){return an(e,aR)}else{aR++}}}throw"node not found"};var an=function(aR,aV){var aU="";for(var aW=aR.length-1;aW>=0;aW--){var aX=aR[aW];aU+="<"+aX.nodeName;if(aW==aR.length-1){aU+=' idx="'+aV+'"'}if(typeof aX.parentPos=="number"){aU+=' p="'+aX.parentPos+'"'}var aT=[];for(var e in aX.attributes){aT[aT.length]=e}aT.sort(y);for(var aS=0;aS<aT.length;aS++){aU+=" "+aT[aS]+'="'+Y(aX.attributes[aT[aS]])+'"'}if(aW==0){aU+="/>"}else{aU+=">"}}for(var aW=1;aW<aR.length;aW++){aU+="</"+aR[aW].nodeName+">"}return aU};var Y=function(e){e=e.replace(/&/g,"&amp;");e=e.replace(/"/g,"&quot;");e=e.replace(/</g,"&lt;");e=e.replace(/\t/g,"&#09;");return e.replace(/>/g,"&gt;")};var U=function(aS,aR){var aV=aS[0];var aU=document.getElementsByTagName(aV.nodeName);var e=0;for(var aT=0;aT<aU.length;aT++){if(q(aU[aT],aS,0)){if(aR==e){return aU[aT]}else{e++}}}throw"node not found"};var q=function(aU,e,aS){if(e.length<=aS){return true}var aV=e[aS];if(aV.nodeName!=aU.nodeName.toLowerCase()){return false}for(var aY in aV.attributes){var a0=x(aU,aY);if(a0!=aV.attributes[aY]){return false}}if(typeof aV.parentPos=="number"){var aR=aV.parentPos;if((!aU.parentNode||aU.parentNode==document)&&aR==0){return true}var aW=false;var aX=aU.parentNode.childNodes;var aZ=0;for(var aT=0;aT<aX.length;aT++){if(aX[aT]==aU){if(aR==aZ){aW=true;break}else{return false}}else{if(aX[aT].nodeName.toLowerCase()==aV.nodeName){aZ++}}}if(!aW){return false}}return q(aU.parentNode,e,aS+1)};var I=function(aR,aW,aV){var aT={};aV[aV.length]=aT;aT.nodeName=aR.nodeName.toLowerCase();aT.attributes={};var aS=aR.parentNode;if(aS==document||!aS){return}if(ELEMENTID_BY_TAGNAME_USE_PARENTPOS){var aU=aS.childNodes;var aX=0;for(var e=0;e<aU.length;e++){if(aU[e]==aR){aT.parentPos=aX;break}else{if(aU[e].nodeName.toLowerCase()==aT.nodeName){aX++}}}}if(aS.nodeName.toLowerCase()=="tbody"||aS.nodeName.toLowerCase()=="table"){return}if(aW>0){I(aS,aW-1,aV)}return};var A=function(){var aU="emosTransmit".length;if(j){try{for(var aV=0;aV<window.sessionStorage.length;aV++){var aY=window.sessionStorage.key(aV);if(aY.substr(0,aU)=="emosTransmit"){var aR=Number(aY.substr(aU));ax=Math.max(ax,aR);var aS=window.sessionStorage.getItem(aY);aL(aR,LOG_URL+"?"+aS)}}}catch(aW){}}else{var aZ=document.cookie.split(";");for(var aV=0;aV<aZ.length;aV++){var aT=aZ[aV];if(aT.charAt(0)==" "){aT=aT.substr(1)}if(aT.substr(0,aU)=="emosTransmit"){var aX=aT.indexOf("=");if(aX<0){continue}var aR=Number(aT.substring(aU,aX));var aS=aT.substring(aX+1);ax=Math.max(ax,aR);v(aR,LOG_URL+"?"+aS)}}}};var v=function(e,aS){var aR=new Image();aR.onload=function(){N("emosTransmit"+e);am[e]=null};am[e]=aR;aR.src=aS};var aL=function(e,aS){var aR=new Image();aR.onload=function(){window.sessionStorage.removeItem("emosTransmit"+e);am[e]=null};am[e]=aR;aR.src=aS};var aE=function(aZ){if(!TRACK_FIRSTPARTY){return}var a5=0;if(aZ.billing&&aZ.billing.length>0&&aZ.billing[0].length>3){var aX=Number(aZ.billing[0][3]);if(!isNaN(aX)){a5=Math.round(aX*100)}}var a2=true;if(aQ){aQ=false}else{var a3=ae(COOKIENAME_SESSION_ID);if(a3&&a3.length>0){var a0=a3.split(":");if(a0.length==4){au=a0[0];av=parseInt(a0[1])+1;if(!isNaN(av)){a2=false;aG(COOKIENAME_SESSION_ID,au+":"+av+":"+B+":"+s)}}}}if(a2){var aS=null;if(USE_SYSTEM_SID){var a6=document.getElementsByName("emos_sid");for(var aW=0;aW<a6.length;aW++){var a4=a6[aW].getAttribute("rel",2);if(a4&&a4.length>0){aS=a4;break}a4=a6[aW].getAttribute("title",2);if(a4&&a4.length>0){aS=a4;break}}if(aS==null&&typeof(window.emos_sid)=="string"&&window.emos_sid.length>0){aS=window.emos_sid}}if(aS==null){aS=k()}var aR=aS+":1:"+B+":"+s;aG(COOKIENAME_SESSION_ID,aR);var aU=ae(COOKIENAME_SESSION_ID);if(aR==aU){au=aS;av=1;a2=true}else{au="NULL";av=-1;a2=false}}var a3=ae(COOKIENAME_VISITOR_ID);if(a3&&a3.length>0){var a0=a3.split(":");if(a0.length==5||a0.length==7){F=a0[0];g=parseInt(a0[1])+((a2)?1:0);var e=a0[2];var aV=parseInt(a0[3]);if(a2){M=e;h=s-aV;aV=s}else{M=null;h=null}al=a5;var aY=parseInt(a0[4]);if(a0.length==7){R=("true"==a0[5]);var aT=parseInt(a0[6]);if(aT!=SAMPLING_RATE){R=Math.random()*SAMPLING_RATE<=1}}else{R=Math.random()*SAMPLING_RATE<=1}if(!SAMPLING_MODE_CLICKONLY){L=R}if(!isNaN(aY)){al+=aY}if(!isNaN(g)){aG(COOKIENAME_VISITOR_ID,F+":"+g+":"+au+":"+aV+":"+al+":"+R+":"+SAMPLING_RATE,94608000);return}}}var a1=au;al=a5;R=Math.random()*SAMPLING_RATE<=1;if(!SAMPLING_MODE_CLICKONLY){L=R}var aR=a1+":1:"+au+":"+s+":"+al+":"+R+":"+SAMPLING_RATE;aG(COOKIENAME_VISITOR_ID,aR,94608000);var aU=ae(COOKIENAME_VISITOR_ID);if(aR==aU){F=a1;g=1}else{F="NULL";g=-1}};var ae=function(aU){var e=document.cookie.split(";");for(var aS=0;aS<e.length;aS++){var aR=e[aS];if(aR.charAt(0)==" "){aR=aR.substr(1)}if(aR.substr(0,aU.length)==aU){var aT=aR.indexOf("=");if(aT<0){continue}return aR.substring(aT+1)}}return null};var aG=function(aR,aT,e){var aS=aR+"="+aT+";path=/;";if(COOKIE_DOMAIN){aS=aS+"domain="+COOKIE_DOMAIN+";"}if(e){aS=aS+"max-age="+e+";expires="+new Date(new Date().getTime()+e*1000).toGMTString()+";"}document.cookie=aS};var N=function(e){var aR=e+"=;path=/;max-age=0;";if(COOKIE_DOMAIN){aR=aR+"domain="+COOKIE_DOMAIN+";"}document.cookie=aR};var k=function(){var aT=new Date().getTime();var aV=aT&4294967295;var aU=(aT/4294967296)&4294967295;var e=[];e[e.length]=aU>>>24;e[e.length]=aU>>>16&255;e[e.length]=aU>>>8&255;e[e.length]=aU&255;e[e.length]=aV>>>24;e[e.length]=aV>>>16&255;e[e.length]=aV>>>8&255;e[e.length]=aV&255;for(var aR=0;aR<4;aR++){var aS=(4294967296*Math.random())&4294967295;e[e.length]=aS>>>24;e[e.length]=aS>>>16&255;e[e.length]=aS>>>8&255;e[e.length]=aS&255}return af(e)};var C=function(aR){var aS=[];var e=String.fromCharCode(237);if(e.charCodeAt(0)<0){for(var aU=0;aU<aR.length;aU++){var aT=aR.charCodeAt(aU);if(aT>0){if(aT>=32||aT==9){aS[aS.length]=aT}}else{aS[aS.length]=(((256+aT)>>6)|192);aS[aS.length]=(((256+aT)&63)|128)}}}else{for(var aU=0;aU<aR.length;aU++){var aT=aR.charCodeAt(aU);if(aT<128){if(aT>=32||aT==9){aS[aS.length]=aT}}else{if((aT>127)&&(aT<2048)){aS[aS.length]=((aT>>6)|192);aS[aS.length]=((aT&63)|128)}else{aS[aS.length]=((aT>>12)|224);aS[aS.length]=(((aT>>6)&63)|128);aS[aS.length]=((aT&63)|128)}}}}return aS};var r=function(){var aS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*_";var aR=[];for(var e=0;e<aS.length;e++){aR[e]=aS.charAt(e)}b=aR};var af=function(aV){var aT=b;var aU=[];var aS=0;var e=aV.length;if((e%3)==1){aV[aV.length]=0;aV[aV.length]=0}if((e%3)==2){aV[aV.length]=0}while(aS<aV.length){aU[aU.length]=aT[aV[aS]>>2];aU[aU.length]=aT[((aV[aS]&3)<<4)|(aV[aS+1]>>4)];aU[aU.length]=aT[((aV[aS+1]&15)<<2)|(aV[aS+2]>>6)];aU[aU.length]=aT[aV[aS+2]&63];aS+=3}if((e%3)==1){aU[aU.length-1]=aU[aU.length-2]=""}if((e%3)==2){aU[aU.length-1]=""}var aR=aU.join("");return aR};var aF=function(aZ){var aY;var aU;var a3="";var a9=0;var aS=0;var bb=false;var a2=0;var aW=0;var a5=0;var aT=0;var a8=(typeof(window.emos_campaignName)!="undefined")?window.emos_campaignName:"na";var a7=(typeof(window.emos_sourceId)!="undefined")?window.emos_sourceId:"na";aC={};try{aY=f(top.location.search,true)}catch(bd){aY=f(location.search,true)}try{aU=top.document.referrer}catch(bd){aU=document.referrer}var a6=ah(aU);var bc=c(aU,3);var a4="na";var bf="na";var aR="na";var a1="";var be="na";var a0="na";var aX="na";if(a6!="NULL"){aS=1}if(aU==null||aU.length<1){bb=true;a3="direct"}else{if((aA(bc))||(bc.indexOf("fact-finder")>=0)||(bc.indexOf("heine")>=0)){a3="intern"}else{if(at(aU,aZ,bc)==true){a9=1;a3="suma"}else{a3="ref"}}}if(aY.AffiliateID){a3="cp";a4=aw(aY.AffiliateID);aC.em_affiliateId=a4;if(aY.ActionID){bf=aw(aY.ActionID);aC.em_actionId=bf}if(aY.amktid){aX=aw(aY.amktid);aC.amktid=aX}if(aY.adword){a0=aw(aY.adword);aC.adword=a0}aC.ref=bc;if((aZ.smqp)&&(aZ.smqp.length>2)){aC.smqp=aZ.smqp;if(aZ.smqpe){aC.smqpe=aZ.smqpe}}if(aS){aC.refUrl=a6}}if(a3=="suma"){a4="SEO Shop";bf=bc;aC.em_affiliateId=a4;aC.em_actionId=bf;aC.smqp=aZ.smqp;aC.ref=bc}if(a3=="direct"){a4="Direct";aZ.em_affiliateId=a4}if(a3=="ref"){a4="Backlinks";bf=bc;aZ.em_affiliateId=a4;aZ.em_actionId=bf}if(a3=="intern"){a4="Intern";aZ.em_affiliateId=a4}aZ.source=a3;if((a3=="cp")||aT||(a3=="suma")){aC.source=a3}if(TRACK_FIRSTPARTY){var ba=TRACK_POSTCONVERSION?O():aC;if(ba){for(var aV in ba){aZ[aV]=ba[aV]}}}};var aA=function(e){return(e.split("/")[2]==location.host)};var ad=[["q",null,"ie","start",1],["p",null,null,"b",1],["su",null,null,"pageIndex",10],["query",null,null],["qry_str",null,null],["begriff",null,null],["words",null,null],["encquery",null,null],["qt",null,null],["terms",null,null],["text",/yandex\./g,null],["wd",/\.baidu\./g,null],["w",/\.soso\./g,null],[null,/www\.google\./g,null]];var at=function(aU,aY,aT){var aR;try{aR=f(aU,false)}catch(aX){return false}for(var aW=0;aW<ad.length;aW++){var aV=ad[aW];var aZ=(aV[0])?aR[aV[0]]:"not provided";if(aZ){var aS=aV[1];if(aS==null||aT.search(aS)>=0){if(aV[2]&&aR[aV[2]]){aY.smqpe=aR[aV[2]];aY.smqp=aZ}else{aY.smqp=aw(aZ)}if(aV.length==5){var a0=parseInt(aR[aV[3]]);if(!isNaN(a0)){aY.smstart=a0*aV[4]}}return true}}}return false};var aD=function(aY){var aR;S="";try{aR=f(top.location.search,false)}catch(aX){aR=f(location.search,false)}var aT=aR.emcs0?aR.emcs0:"na";var aV=aR.emcs1?aR.emcs1:"na";var a0=aR.emcs2?aR.emcs2:"na";var aS=aR.emcs3?aR.emcs3:"na";if(aT=="na"){aT=aR.celPHName?aR.celPHName:"na";aV=aR.celRecommendationType?aR.celRecommendationType:"na";a0=aR.celSourceId?aR.celSourceId:"na";aS=aR.celTargetId?aR.celTargetId:"na"}aT=(typeof(emcs0)!="undefined")?emcs0:aT;aV=(typeof(emcs1)!="undefined")?emcs1:aV;a0=(typeof(emcs2)!="undefined")?emcs2:a0;aS=(typeof(emcs3)!="undefined")?emcs3:aS;if(aT!="na"&&aS=="na"){if(aY.ec_Event&&aY.ec_Event[0]&&aY.ec_Event[0][PRODUCT_ID_IN_EC_EVENT]){aS=aY.ec_Event[0][PRODUCT_ID_IN_EC_EVENT]}}if(aT!="na"){aY.crossData=[[aw(aT),aw(aV),aw(a0),aw(aS)]];S=aY.crossData}var aW=ak();if(aW&&aT=="na"){var aZ=aW.split(":");if(aZ.length&&aZ.length>0){aY.crossData=[];for(var aU=0;aU<aZ.length;aU++){aY.crossData[aY.crossData.length]=aZ[aU].split(",")}}else{aY.crossData=aZ[0].split(",")}}};var aH=function(aV){var aU=document.getElementsByName("emos_name");for(var aT=0;aT<aU.length;aT++){var e=aU[aT].title;var aS=aU[aT].rel;var aR=aU[aT].rev;if(e.length>0){if(aS.length>0){if(aR.length>0){aV[e]=[[aw(aS),aw(aR)]]}else{aV[e]=aw(aS)}}}}};var O=function(){if(window.emos_clickIn){aG(ay,"0");aQ=true;}else{var aS=ae(ay);if(aS=="1"){aG(ay,"0");aQ=true}else{if(aS=="0"){aQ=false}}}var aT=ab(aC);if(aT!=""){aG(COOKIENAME_CAMPAIGN,aT,CLIENT_COOKIE_LIFETIME);return aC}else{var aR=ae(COOKIENAME_CAMPAIGN);if(aR&&aR.length>0){var e=az(aR);if(e.scnd&&e.scnd=="1"){carriesSecondaryCookie=true}if(!aQ){e.postconv="1"}return e}}return null};var ak=function(){var aT=ae(COOKIENAME_CROSS);if(S!=""){var aS=String(S);aS=aS.split(",");aS[1]="previous_visit";if(aT&&aT.length>0){var aR=aT.split(":");var aU=[];if(aR.length>0){for(var e=0;e<aR.length;e++){if(aR[e]==aS){return aT}else{aU[e+1]=aR[e]}}aU[0]=aS;if(aU.length>5){aU.length=5}}aS=aU.join(":");aG(COOKIENAME_CROSS,aS,CLIENT_COOKIE_LIFETIME);return aS}else{aG(COOKIENAME_CROSS,aS,CLIENT_COOKIE_LIFETIME);return aS}}else{if(aT&&aT.length>0){return aT}}return null};var T=function(aU,aS){try{if(aU){if(aU.length&&aU.length>0){aS.ec_Event=[];for(var aR=0;aR<aU.length;aR++){aS.ec_Event[aS.ec_Event.length]=aK(aU[aR])}}else{aS.ec_Event=[aK(aU)]}}}catch(aT){}};var aK=function(aS){var e=aN(aS,"event");var aR=aN(aS,"id");var aW=aN(aS,"name");var aZ=aN(aS,"preis");var aY=aN(aS,"group");var aX=aN(aS,"anzahl");var aV=aN(aS,"var1");var aU=aN(aS,"var2");var aT=aN(aS,"var3");return[e,aR,aW,aZ,aY,aX,aV,aU,aT]};var aN=function(aR,e){return aR[e]?aw(aR[e]):"NULL"};var V=function(aR){try{if(window.emosCustomPageArray){aR[aw(window.emosCustomPageArray[0])]=[p(window.emosCustomPageArray.slice(1))]}}catch(aS){}};var E=function(aT){try{if(window.emosCustomMultiArray&&window.emosMultiArrayID){var aR=[];for(var aS=0;aS<window.emosCustomMultiArray.length;aS++){aR[aS]=p(window.emosCustomMultiArray[aS])}aT[aw(window.emosMultiArrayID)]=aR}}catch(aU){}};var w=function(aT,aR){try{if(aT){aR.billing=[p(aT)]}}catch(aS){}};var aa=function(aS,aU){try{if(aS){aU.ec_Event=[];for(var aR=0;aR<aS.length;aR++){var aT=["buy"];for(var aW=0;aW<aS[aR].length;aW++){aT[aW+1]=aw(aS[aR][aW])}aU.ec_Event[aU.ec_Event.length]=aT}}}catch(aV){}};var ac=function(aT,aR,aV){try{if(aR&&aT){var aS=[];for(var aU=0;aU<aR.length;aU++){aS[aU]=p(aR[aU])}aV[aw(aT)]=aS}}catch(aW){}};var ap=function(){if(COOKIE_DOMAIN==null){var e=window.location.hostname.split(".");var aT=e[e.length-1];var aU=e[e.length-2];var aS=(aT=="uk"||aT=="tr"||aT=="br"||(aT=="at"&&aU=="co")||(aT=="jp"&&(aU=="co"||aU=="ac"||aU=="go"||aU=="ne"||aU=="or")))?3:2;if(isNaN(parseInt(aT))&&e.length>=aS){COOKIE_DOMAIN="";for(var aR=e.length-aS;aR<e.length;aR++){COOKIE_DOMAIN=COOKIE_DOMAIN+"."+e[aR]}}else{COOKIE_DOMAIN=window.location.hostname}}};var D=function(e){for(var aR in e){return true}return false};var Z=function(aS,aR){for(var e in aR){aS[e]=aR[e]}};window.emos_ecEvent=function(aY,aS,aR,a0,aZ,aW,aV,aU,aT){var aX={};o(aX);var e=[[aw(aY),aw(aS),aw(aR),aw(a0),aw(aZ),aw(aW),aw(aV),aw(aU),aw(aT)]];aX.ec_Event=e;X(aX,EVENT_MILLIS);return true};window.emosPropertiesEvent=function(aR){var e={};o(e);Z(e,aR);X(e,0);return true};window.emos_userEvent1=function(e,aS){var aR={};o(aR);aR[e]=aw(aS);X(aR,EVENT_MILLIS);return true};window.emos_userEvent2=function(e,aS,aR){var aT={};o(aT);aT[e]=[[aw(aS),aw(aR)]];X(aT,EVENT_MILLIS);return true};window.emosTargetEvent=function(aT,aV,aU,aS){var e={};o(e);var aR=0;if(typeof aU=="boolean"){if(aU){e.cGoal="1";aR=1}}else{if(typeof aU=="number"){if(aU!=0){e.cGoal="1";aR=aU}}else{if(typeof aU=="string"){if(aU!="0"){e.cGoal="1";aR=aU}}}}if(typeof aS!="string"){aS="d"}e.Target=[[aw(aT),aw(aV),aR,aS]];if(SECOND_ACTIVE){e.secLabel="Target"}e.content="Target_"+aw(aT)+"_"+aw(aV);X(e,EVENT_MILLIS);return true};window.emosLeadEvent=function(aT,aW,aU,aS,aR,aV){var e={};o(e);e.LeadEvent=[[aT,aw(aW),aw(aU),aw(aS),aw(aR)]];if(aV){e.cGoal="1"}X(e,EVENT_MILLIS);return true};window.emosCustomEvent=function(aU,aT,e,aR,aV){var aS={};o(aS);aS[aU]=[[aw(aT),aw(e),aw(aR),aw(aV)]];X(aS,EVENT_MILLIS);return true};window.emosUserEvent=function(aR,aT,aS){var e={};o(e);e.uEvent=[[aR,aw(aT),aw(aS)]];X(e,EVENT_MILLIS);return true};var p=function(aS){var aR=[];for(var e=0;e<aS.length;e++){aR[e]=aw(aS[e])}return aR};window.emosBuyEvent=function(aS,e){var aR={};o(aR);w(aS,aR);aa(e,aR);if(SECOND_ACTIVE){aR.secLabel="ThankYou"}X(aR,EVENT_MILLIS);return true};window.emosFreeEvent=function(aR,e){var aS={};o(aS);ac(aR,e,aS);X(aS,EVENT_MILLIS);return true};window.emos_submitFormData=function(aS){if(!document.forms[aS]){return true}var aR={};o(aR);var e=[];for(var aT=0;aT<(document.forms[aS].elements.length);aT++){if(document.forms[aS].elements[aT].value!=""){e[aT]=[aw(document.forms[aS].elements[aT].name),aw(document.forms[aS].elements[aT].value)]}}aR.fName=aS;aR.fData=[e];X(aR,EVENT_MILLIS);return true};var f=function(aW,aR){var aV=aW.indexOf("?");if(aV>=0){aW=aW.substr(aV+1)}var aU={};var aS=aW.split("&");for(var e=0;e<aS.length;e++){var aT=aS[e].split("=");if(aT[1]){if(aR){aU[aT[0]]=aw(aT[1])}else{aU[aT[0]]=aT[1]}}else{aU[aT[0]]=""}}return aU};var aj=function(){aq();ap();n();r();A();if(window.emos_clickIn){aF({})}if(TRACK_VERSION==1){G()}if(!L){return}if(TRACK_VERSION==1&&window.addEventListener){window.addEventListener("pageshow",function(e){if(e.persisted){G()}},false)}if(CAPTURE_CLICKS&&R){aM(document,"mousedown",aO)}};aj()})();