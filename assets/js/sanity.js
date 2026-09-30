(function(g){
var PID="46ond6td",DS="production",VER="2026-09-28";
function sanityFetch(q,params){
  var u="https://"+PID+".apicdn.sanity.io/v"+VER+"/data/query/"+DS+"?query="+encodeURIComponent(q);
  if(params){for(var k in params){u+="&$"+k+"="+encodeURIComponent(JSON.stringify(params[k]))}}
  return fetch(u).then(function(r){if(!r.ok)throw new Error("sanity "+r.status);return r.json()}).then(function(d){return d.result});
}
function esc(s){return (s==null?"":String(s)).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function pt(blocks){
  if(!Array.isArray(blocks))return "";
  return blocks.map(function(b){
    if(b._type!=="block"||!Array.isArray(b.children))return "";
    return "<p>"+b.children.map(function(c){return esc(c.text||"")}).join("")+"</p>";
  }).join("");
}
g.ASGCms={fetch:sanityFetch,esc:esc,portableText:pt,projectId:PID,dataset:DS};
})(window);