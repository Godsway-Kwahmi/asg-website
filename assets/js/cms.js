(function(){
if(!window.ASGCms)return;
var C=window.ASGCms,$=function(id){return document.getElementById(id)},refit=function(){if(window.ASGRefit)window.ASGRefit()};

function cardsHtml(items){
  return items.map(function(it,i){
    var cls=["","r","g"][i%3];
    return '<article class="card '+cls+'"><h3>'+C.esc(it.title)+'</h3><p>'+it.body+'</p></article>';
  }).join("");
}

function hydrateFooter(){
  C.fetch('*[_id=="siteSettings"][0]{contactEmail,contactPhone,address,socialLinks}').then(function(s){
    if(!s)return;
    var em=$("footer-email"),ph=$("footer-phone"),ad=$("footer-address"),so=$("footer-socials"),
        ce=$("contact-email"),cp=$("contact-phone"),ca=$("contact-address");
    if(em&&s.contactEmail){em.textContent=s.contactEmail;em.href="mailto:"+s.contactEmail}
    if(ph&&s.contactPhone){ph.textContent=s.contactPhone;ph.href="tel:"+s.contactPhone.replace(/[^+\d]/g,"")}
    if(ad&&s.address)ad.textContent=s.address;
    if(ce&&s.contactEmail){ce.textContent=s.contactEmail;ce.href="mailto:"+s.contactEmail}
    if(cp&&s.contactPhone){cp.textContent=s.contactPhone;cp.href="tel:"+s.contactPhone.replace(/[^+\d]/g,"")}
    if(ca&&s.address)ca.textContent=s.address;
    if(so&&Array.isArray(s.socialLinks)&&s.socialLinks.length){
      so.innerHTML=s.socialLinks.map(function(l){return '<a href="'+C.esc(l.url)+'" target="_blank" rel="noopener">'+C.esc(l.platform)+'</a>'}).join("");
    }
    refit();
  }).catch(function(){});
}

function hydrateAbout(){
  C.fetch('*[_type=="feature"&&page=="about"]|order(order asc){title,description}').then(function(rows){
    var el=$("feat-cards");
    if(el&&rows&&rows.length)el.innerHTML=cardsHtml(rows.map(function(r){return {title:r.title,body:C.esc(r.description||"")}}));
    refit();
  }).catch(function(){});
  C.fetch('*[_type=="partner"]|order(name asc){name,url}').then(function(rows){
    var el=$("partner-tiles");
    if(el&&rows&&rows.length)el.innerHTML=rows.map(function(p){
      var open=p.url?'<a class="tile" href="'+C.esc(p.url)+'" target="_blank" rel="noopener" style="text-decoration:none">':'<a class="tile" href="about.html#partners" style="text-decoration:none">';
      return open+C.esc(p.name)+'</a>';
    }).join("");
    refit();
  }).catch(function(){});
}

function hydrateEvents(){
  C.fetch('*[_type=="event"&&featured==true][0]{title,description,venue,date}').then(function(ev){
    var el=$("agm-detail");
    if(el&&ev){
      var d=ev.date?new Date(ev.date).toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"";
      el.innerHTML='<p>'+C.esc(ev.description||"")+'</p>'+(d?'<p>Date: '+C.esc(d)+'</p>':'')+(ev.venue?'<p>Venue: '+C.esc(ev.venue)+'</p>':'');
    }
    refit();
  }).catch(function(){});
  C.fetch('*[_type=="event"&&featured!=true]|order(date asc){title,description,venue,date,externalLink}').then(function(rows){
    var el=$("event-cards");
    if(el&&rows&&rows.length)el.innerHTML=cardsHtml(rows.map(function(r){
      var d=r.date?new Date(r.date).toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short",year:"numeric"}):"";
      var more=r.externalLink?' <a href="'+C.esc(r.externalLink)+'">Details</a>':"";
      return {title:r.title,body:C.esc((d?d+". ":"")+(r.venue||"")+(r.description?" — "+r.description:""))+more};
    }));
    refit();
  }).catch(function(){});
}

function hydrateJobs(){
  C.fetch('*[_type=="jobPost"&&active==true]{title,company,description,applyEmail}').then(function(rows){
    var el=$("job-cards");
    if(el&&rows&&rows.length)el.innerHTML=cardsHtml(rows.map(function(r){
      var mail="mailto:"+(r.applyEmail||"info@asg.com")+"?subject="+encodeURIComponent("Application: "+(r.title||""));
      return {title:r.title,body:C.esc((r.company?r.company+". ":"")+(r.description||""))+' <a href="'+mail+'">Apply</a>'};
    }));
    refit();
  }).catch(function(){});
}

function hydrateNews(){
  C.fetch('*[_type=="newsPost"]|order(date desc){title,summary,date,body}').then(function(rows){
    var el=$("news-list");
    if(el&&rows&&rows.length)el.innerHTML=rows.map(function(r){
      var d=r.date?new Date(r.date).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}):"";
      return '<section class="sc"><h2>'+C.esc(r.title)+'</h2><i class="rl"></i>'+(d?'<p><em>'+C.esc(d)+'</em></p>':"")+'<p>'+C.esc(r.summary||"")+'</p>'+C.portableText(r.body)+'</section>';
    }).join("");
    refit();
  }).catch(function(){});
}

function hydrateShop(){
  C.fetch('*[_type=="product"]{name,description,price,orderEmail}').then(function(rows){
    var el=$("shop-cards");
    if(el&&rows&&rows.length)el.innerHTML=cardsHtml(rows.map(function(r){
      var mail="mailto:"+(r.orderEmail||"info@asg.com")+"?subject="+encodeURIComponent("Order: "+(r.name||""));
      return {title:r.name,body:C.esc((r.description||"")+(r.price?" — "+r.price:""))+' <a href="'+mail+'">Buy</a>'};
    }));
    refit();
  }).catch(function(){});
}

function hydrateJoin(){
  C.fetch('*[_type=="faqItem"]|order(order asc){question,answer}').then(function(rows){
    var el=$("faq-list");
    if(el&&rows&&rows.length)el.innerHTML=rows.map(function(r){return '<details><summary>'+C.esc(r.question)+'</summary><p>'+C.esc(r.answer||"")+'</p></details>'}).join("");
    refit();
  }).catch(function(){});
}

function hydrateLegal(slug){
  C.fetch('*[_type=="page"&&slug.current==$slug][0]{title,intro,body}',{slug:slug}).then(function(p){
    var el=$("legal-body");
    if(el&&p){el.innerHTML=(p.intro?'<p>'+C.esc(p.intro)+'</p>':"")+C.portableText(p.body)}
    refit();
  }).catch(function(){});
}

function hydrateHome(){
  C.fetch('*[_type=="jobPost"&&active==true]|order(_createdAt asc)[0...3]{title,company,description}').then(function(rows){
    (rows||[]).forEach(function(r,i){
      var co=$("hp-job-"+i+"-company"),ti=$("hp-job-"+i+"-title"),de=$("hp-job-"+i+"-desc");
      if(co&&r.company)co.textContent=r.company;
      if(ti&&r.title)ti.textContent=r.title;
      if(de&&r.description)de.textContent=r.description;
    });
    refit();
  }).catch(function(){});
  C.fetch('*[_type=="newsPost"]|order(date desc)[0]{title,summary}').then(function(n){
    var ti=$("hp-news-title"),su=$("hp-news-summary");
    if(n&&ti&&n.title)ti.textContent=n.title;
    if(n&&su&&n.summary)su.textContent=n.summary;
    refit();
  }).catch(function(){});
  C.fetch('*[_type=="product"][0]{name,description}').then(function(p){
    var ti=$("hp-product-title"),de=$("hp-product-desc");
    if(p&&ti&&p.name)ti.textContent=p.name;
    if(p&&de&&p.description)de.textContent=p.description;
    refit();
  }).catch(function(){});
  C.fetch('*[_type=="partner"]|order(name asc)[0...3]{name}').then(function(rows){
    (rows||[]).forEach(function(p,i){var el=$("hp-partner-"+i);if(el&&p.name)el.textContent=p.name});
    refit();
  }).catch(function(){});
}

hydrateFooter();
var page=document.body.dataset.p;
({about:hydrateAbout,events:hydrateEvents,jobs:hydrateJobs,news:hydrateNews,shop:hydrateShop,join:hydrateJoin,
  privacy:function(){hydrateLegal("privacy")},cookies:function(){hydrateLegal("cookies")},"ai-policy":function(){hydrateLegal("ai-policy")},
  home:hydrateHome}[page]||function(){})();
})();