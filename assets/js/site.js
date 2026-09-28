(function(){
var N=[["About ASG","about"],["Events","events"],["Learn","learn"],["Get in touch","contact"],["Shop","shop"]],cur=document.body.dataset.p,
L='<i class="a"></i><i class="l"></i><i class="c"></i><span class="w1" style="left:65px;top:41.5px">ARCHITECTURAL</span><span class="w2" style="left:65px;top:56.5px">SOCIETY</span><span style="left:122px;top:56.5px">OF</span><span style="left:65px;top:71.5px">GHANA</span><span class="pl"></span>',
logo=function(c,s){return '<a class="logo'+c+'" href="index.html" aria-label="Architectural Society of Ghana, home" style="'+s+'">'+L+'</a>'},
ext=function(n,u){return '<a href="'+u+'" target="_blank" rel="noopener">'+n+'</a>'},
hd=logo('','left:105px;top:93px')+'<nav class="nv" aria-label="Main">'+N.map(function(n){return '<a href="'+n[1]+'.html"'+(n[1]==cur?' aria-current="page"':'')+'>'+n[0]+'</a>'}).join('<i class="sep"></i>')+'</nav><div class="ac"><form action="search.html" role="search"><input class="q" type="search" name="q" aria-label="Search"></form><a href="search.html">search</a><i class="sep"></i><a href="login.html">log in</a><i class="sep"></i><a href="register.html">Register</a></div>',
ft='<div class="b" style="left:0;top:0;width:1920px;height:278px;background:var(--bright)"></div>'+logo(' inv','left:278px;top:54px')
+'<nav class="fl" aria-label="Footer" style="left:644px;top:51px">'+N.map(function(n){return '<a href="'+n[1]+'.html">'+n[0]+'</a>'}).join('')+'</nav><i class="sep r" style="left:743px;top:56px"></i>'
+'<div class="fl" style="left:819px;top:51px">'+ext('Instagram','https://www.instagram.com/')+ext('Facebook','https://www.facebook.com/')+ext('Youtube','https://www.youtube.com/')+ext('LinkedIn','https://www.linkedin.com/')+'</div><i class="sep r" style="left:918px;top:95px"></i>'
+'<div class="fl" style="left:994px;top:51px"><a href="mailto:info@asg.com">info@asg.com</a><a href="tel:+2330568769823">+233 056 876 9823</a></div><i class="sep r" style="left:1093px;top:95px"></i>'
+'<p class="t" style="left:992px;top:132px;font-size:19px;line-height:27px;font-weight:400">No. 9 Atsuru street</p>'
+'<div class="b" style="left:0;top:278px;width:1920px;height:78px;background:var(--rust)"></div><p class="t u" style="left:278px;top:309px">All rights reserved ASG Media 2026</p>'
+'<a class="t u" href="privacy.html" style="left:642px;top:309px">Privacy Policy</a><i class="sep w" style="left:753px;top:314px"></i><a class="t u" href="cookies.html" style="left:763px;top:309px">Cookie Policy</a><i class="sep w" style="left:873px;top:314px"></i><a class="t u" href="ai-policy.html" style="left:883px;top:309px">AI Policy</a>';
document.getElementById("hd").insertAdjacentHTML("afterbegin",hd);document.getElementById("ft").innerHTML=ft;
var q=new URLSearchParams(location.search).get("q"),i=document.querySelector(".q");if(q&&i)i.value=q;
document.querySelectorAll("form[data-demo]").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();f.querySelector("[role=status]").textContent="Member login isn’t connected yet. Email info@asg.com for access."})});
var pg=document.getElementById("page");function fit(){var s=document.documentElement.clientWidth/1920;if(CSS.supports("zoom","1"))pg.style.zoom=s;else{pg.style.transform="scale("+s+")";document.body.style.height=pg.offsetHeight*s+"px"}}
fit();addEventListener("resize",fit);addEventListener("load",fit);
})();