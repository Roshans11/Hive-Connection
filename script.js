// script.js - dynamic front-end (client-only)
// Save this as script.js in same folder.

document.addEventListener('DOMContentLoaded',()=>{

  /* ---------- sample data ---------- */
  const sample = {
    announcements:[
      {id:1,text:'Exam schedule released - check notices.'},
      {id:2,text:'Hackathon next week — form your teams.'}
    ],
    events:[
      {id:1,title:'Alumni Talk: Career in AI', date:'2025-09-15T16:00', details:'Speaker: Dr. A. Talks about industry careers.'},
      {id:2,title:'Placement Drive: XYZ Corp', date:'2025-09-28T10:00', details:'On-campus drive.'}
    ],
    mentorships:[
      {id:1,alumniId:1,alumniName:'Jane Smith',topic:'Career in Web Dev',date:'2025-09-20T18:00'},
      {id:2,alumniId:2,alumniName:'Rahul Verma',topic:'Data Science Path',date:'2025-09-22T17:00'}
    ],
    alumni:[
      {id:1,name:'Jane Smith',branch:'CSE',year:'2020',role:'Frontend Engineer',company:'Google',skills:['React','CSS','UI']},
      {id:2,name:'Rahul Verma',branch:'ECE',year:'2021',role:'Data Scientist',company:'Amazon',skills:['Python','ML','DataViz']},
      {id:3,name:'Priya Kapoor',branch:'CSE',year:'2019',role:'Product Designer',company:'Spotify',skills:['Figma','UX','Research']},
      {id:4,name:'Amit Kumar',branch:'ME',year:'2020',role:'Mechanical Engineer',company:'Bosch',skills:['SolidWorks','CAD']}
    ],
    internships:[
      {id:1, title:'Frontend Intern (Remote)',domain:'Web',postedBy:'Jane Smith',deadline:'2025-10-15'},
      {id:2, title:'ML Research Intern',domain:'AI/ML',postedBy:'Rahul Verma',deadline:'2025-10-05'}
    ],
    blogs:[
      {id:1,title:'Future of AI',author:'Rahul Verma',excerpt:'A quick look into the trends shaping AI.'},
      {id:2,title:'Design systems at scale',author:'Priya Kapoor',excerpt:'How to build reusable components.'}
    ],
    webinars:[
      {id:1,title:'Cloud Computing 101',date:'2025-09-18T15:00',host:'Alumni Panel'},
      {id:2,title:'Interview Prep Workshop',date:'2025-10-02T18:00',host:'Placement Cell'}
    ],
    projects:[
      {id:1,title:'E-commerce Demo',tech:['React','Node'],desc:'Simple shop demo',by:'Alumni Team'}
    ],
    pastVideos:[
      {id:1,title:'Intro to React',file:''},
      {id:2,title:'Data Science Crash',file:''}
    ],
    gallery:[
      {id:1,title:'Hackathon 2025'},
      {id:2,title:'Alumni Meetup Sept'}
    ]
  };

  /* ---------- utility + storage ---------- */
  const storage = {
    get(key,def){ return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); },
    set(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
  };

  // init persisted data if not present
  if(!localStorage.getItem('hc_data')) storage.set('hc_data', sample);

  let data = storage.get('hc_data', sample);

  // save helper
  function save(){
    storage.set('hc_data', data);
  }

  /* ---------- UI helpers ---------- */
  function setActiveLink(section){
    document.querySelectorAll('.nav-link').forEach(a=>a.classList.remove('active'));
    const link = Array.from(document.querySelectorAll('.nav-link')).find(n => n.dataset.section === section);
    if(link) link.classList.add('active');
    const title = section.charAt(0).toUpperCase()+section.slice(1);
    document.getElementById('page-title').textContent = title;
  }

  function showSection(section){
    document.querySelectorAll('.section').forEach(s => s.classList.remove('visible'));
    const el = document.getElementById(section);
    if(el) el.classList.add('visible');
    setActiveLink(section);
  }

  // navigation links
  document.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click',(e)=>{
      const sec = link.dataset.section;
      showSection(sec);
    });
  });

  /* ---------- DASHBOARD ---------- */
  function renderAnnouncements(){
    const ul = document.getElementById('announcements-list');
    ul.innerHTML = '';
    data.announcements.forEach(a=>{
      const li = document.createElement('li');
      li.textContent = a.text;
      ul.appendChild(li);
    });
  }

  function renderEvents(){
    const wrap = document.getElementById('events-list');
    wrap.innerHTML = '';
    data.events.forEach(ev=>{
      const div = document.createElement('div');
      div.className = 'event-row';
      const d = new Date(ev.date);
      div.innerHTML = `<strong>${ev.title}</strong><div class="kv">${d.toLocaleString()}</div>
        <div class="kv">${ev.details}</div>
        <div style="margin-top:8px"><button class="btn-inline" data-id="${ev.id}">Details</button></div>`;
      wrap.appendChild(div);
    });
    wrap.querySelectorAll('.btn-inline').forEach(b=>{
      b.addEventListener('click', ()=> {
        const id = Number(b.dataset.id);
        const ev = data.events.find(x=>x.id===id);
        showModal(`<h3>${ev.title}</h3><p><strong>When:</strong> ${new Date(ev.date).toLocaleString()}</p><p>${ev.details}</p><div class="form-row"><button id="modal-close">Close</button></div>`);
      });
    });
  }

  // Mentorships
  function renderMentorships(){
    const wrap = document.getElementById('mentorships-list');
    wrap.innerHTML = '';
    data.mentorships.forEach(m=>{
      const d = new Date(m.date);
      const el = document.createElement('div');
      el.className = 'kv';
      el.innerHTML = `<strong>${m.topic}</strong> — ${m.alumniName}<br><span class="kv">${d.toLocaleString()}</span>
        <div style="margin-top:6px"><button class="rsvp-btn" data-id="${m.id}">RSVP</button></div>`;
      wrap.appendChild(el);
    });
    wrap.querySelectorAll('.rsvp-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = Number(b.dataset.id);
        const my = storage.get('hc_rsvps', []);
        if(!my.includes(id)){
          my.push(id);
          storage.set('hc_rsvps', my);
          renderMyRsvps();
          alert('RSVP saved locally.');
        } else alert('You already RSVPed.');
      });
    });
  }

  function renderMyRsvps(){
    const node = document.getElementById('my-rsvps');
    const my = storage.get('hc_rsvps', []);
    if(!my.length){ node.textContent = 'No RSVPs yet'; return; }
    node.innerHTML = '';
    my.forEach(id=>{
      const m = data.mentorships.find(x=>x.id===id);
      if(m){
        const el = document.createElement('div');
        el.innerHTML = `<div><strong>${m.topic}</strong> — ${m.alumniName} <div class="kv">${new Date(m.date).toLocaleString()}</div></div>`;
        node.appendChild(el);
      }
    });
  }

  /* ---------- ALUMNI ---------- */
  function populateFilters(){
    const branches = Array.from(new Set(data.alumni.map(a=>a.branch)));
    const years = Array.from(new Set(data.alumni.map(a=>a.year)));
    const branchSel = document.getElementById('filter-branch');
    const yearSel = document.getElementById('filter-year');
    branchSel.innerHTML = '<option value="">All Branches</option>';
    yearSel.innerHTML = '<option value="">All Years</option>';
    branches.forEach(b=>branchSel.insertAdjacentHTML('beforeend', `<option>${b}</option>`));
    years.forEach(y=>yearSel.insertAdjacentHTML('beforeend', `<option>${y}</option>`));
  }
  function renderAlumniList(filters = {}){
    const wrap = document.getElementById('alumni-results');
    wrap.innerHTML = '';
    const list = data.alumni.filter(a=>{
      if(filters.branch && a.branch !== filters.branch) return false;
      if(filters.year && a.year !== filters.year) return false;
      if(filters.skill && !a.skills.join(' ').toLowerCase().includes(filters.skill.toLowerCase())) return false;
      return true;
    });
    if(!list.length) { wrap.innerHTML = '<div class="card">No alumni found.</div>'; return; }
    list.forEach(a=>{
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<strong>${a.name}</strong><div class="kv">${a.branch} • ${a.year}</div>
        <div class="kv">${a.role} at ${a.company}</div>
        <div style="margin-top:8px">${a.skills.map(s=>`<span class="kv" style="margin-right:6px">${s}</span>`).join('')}</div>
        <div style="margin-top:8px"><button class="view-alumni" data-id="${a.id}">View</button></div>`;
      wrap.appendChild(card);
    });
    wrap.querySelectorAll('.view-alumni').forEach(btn=>{
      btn.addEventListener('click', ()=> {
        const id = Number(btn.dataset.id);
        const a = data.alumni.find(x=>x.id===id);
        if(!a) return;
        showModal(`<h3>${a.name}</h3>
          <div class="kv">${a.branch} • ${a.year}</div>
          <p><strong>${a.role} — ${a.company}</strong></p>
          <p><strong>Skills:</strong> ${a.skills.join(', ')}</p>
          <div class="form-row"><button id="connect-btn">Connect</button><button id="close-modal">Close</button></div>`);
        document.getElementById('connect-btn').addEventListener('click',()=>{
          alert('Connection request sent (simulated). Use backend API to actually connect.');
        });
      });
    });
  }
  document.getElementById('btn-filter').addEventListener('click',()=>{
    const branch=document.getElementById('filter-branch').value;
    const year=document.getElementById('filter-year').value;
    const skill=document.getElementById('filter-skill').value;
    renderAlumniList({branch,year,skill});
  });
  document.getElementById('btn-clear-filters').addEventListener('click',()=>{
    document.getElementById('filter-branch').value='';
    document.getElementById('filter-year').value='';
    document.getElementById('filter-skill').value='';
    renderAlumniList({});
  });

  /* ---------- INTERNSHIPS ---------- */
  function renderInternships(){
    const wrap = document.getElementById('internship-list');
    wrap.innerHTML = '';
    data.internships.forEach(i=>{
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML = `<strong>${i.title}</strong><div class="kv">Domain: ${i.domain} • Posted by ${i.postedBy}</div>
        <div class="kv">Deadline: ${i.deadline}</div>
        <div style="margin-top:8px"><button class="apply-btn" data-id="${i.id}">Apply</button></div>`;
      wrap.appendChild(card);
    });
    wrap.querySelectorAll('.apply-btn').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = Number(b.dataset.id);
        showModal(`<h3>Apply</h3><p>Applying to: ${data.internships.find(x=>x.id===id).title}</p>
          <form id="apply-form"><input id="app-name" placeholder="Your name" required /><input id="app-email" placeholder="Email" required />
            <div class="form-row"><button type="submit">Submit</button><button id="cancel" type="button">Cancel</button></div></form>`);
        document.getElementById('cancel').addEventListener('click', closeModal);
        document.getElementById('apply-form').addEventListener('submit',(ev)=>{
          ev.preventDefault();
          const name = document.getElementById('app-name').value;
          const email = document.getElementById('app-email').value;
          const apps = storage.get('hc_apps', []);
          apps.push({internId:id,name,email,when:new Date().toISOString()});
          storage.set('hc_apps', apps);
          renderMyApplications();
          closeModal();
          alert('Application submitted (saved locally).');
        });
      });
    });
  }
  function renderMyApplications(){
    const list = storage.get('hc_apps', []);
    const node = document.getElementById('my-applications');
    if(!list.length) { node.textContent = 'No applications yet'; return; }
    node.innerHTML = '';
    list.forEach(a=>{
      const i = data.internships.find(x=>x.id===a.internId);
      const div = document.createElement('div');
      div.className='kv';
      div.innerHTML = `<strong>${i ? i.title : 'Opportunity'}</strong> — ${a.name} • ${new Date(a.when).toLocaleString()}`;
      node.appendChild(div);
    });
  }

  /* ---------- Blogs & Webinars ---------- */
  function renderBlogs(){
    const wrap = document.getElementById('blog-list');
    wrap.innerHTML = '';
    data.blogs.forEach(b=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `<strong>${b.title}</strong><div class="kv">By ${b.author}</div><p class="kv">${b.excerpt}</p><div style="margin-top:8px"><button class="read-blog" data-id="${b.id}">Read</button></div>`;
      wrap.appendChild(card);
    });
    wrap.querySelectorAll('.read-blog').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id=Number(btn.dataset.id);
        const b=data.blogs.find(x=>x.id===id);
        showModal(`<h3>${b.title}</h3><p class="kv">By ${b.author}</p><p>${b.excerpt} — full article would be loaded from backend.</p><div class="form-row"><button id="closeb">Close</button></div>`);
        document.getElementById('closeb').addEventListener('click',closeModal);
      });
    });
  }
  function renderWebinars(){
    const wrap = document.getElementById('webinar-list'); wrap.innerHTML='';
    data.webinars.forEach(w=>{
      const d=new Date(w.date);
      const card=document.createElement('div'); card.className='card';
      card.innerHTML=`<strong>${w.title}</strong><div class="kv">${d.toLocaleString()} • Host: ${w.host}</div><div style="margin-top:8px"><button class="reg-web" data-id="${w.id}">Register</button></div>`;
      wrap.appendChild(card);
    });
    wrap.querySelectorAll('.reg-web').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id=Number(btn.dataset.id);
        const regs = storage.get('hc_webregs', []);
        if(!regs.includes(id)){ regs.push(id); storage.set('hc_webregs', regs); alert('Registered for webinar (local).'); renderWebinars(); }
        else alert('Already registered.');
      });
    });
  }

  /* ---------- Projects ---------- */
  document.getElementById('project-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const title=document.getElementById('project-title').value.trim();
    const tech=document.getElementById('project-tech').value.split(',').map(s=>s.trim()).filter(Boolean);
    const desc=document.getElementById('project-desc').value.trim();
    if(!title) return alert('Title required');
    const id = (data.projects.length?Math.max(...data.projects.map(p=>p.id))+1:1);
    data.projects.push({id,title,tech,desc,by:'Student'});
    save(); renderProjects();
    document.getElementById('project-form').reset();
  });
  document.getElementById('project-clear').addEventListener('click',()=>document.getElementById('project-form').reset());
  function renderProjects(){
    const wrap = document.getElementById('project-list'); wrap.innerHTML='';
    data.projects.forEach(p=>{
      const card=document.createElement('div'); card.className='card';
      card.innerHTML=`<strong>${p.title}</strong><div class="kv">${p.by}</div><p class="kv">${p.desc}</p><div style="margin-top:8px">${p.tech.map(t=>`<span class="kv" style="margin-right:6px">${t}</span>`).join('')}</div>`;
      wrap.appendChild(card);
    });
  }

  /* ---------- Sections (videos) ---------- */
  function renderVideos() {
  const past = document.getElementById('past-videos');
  past.innerHTML = '';

  data.pastVideos.forEach(v => {
    const div = document.createElement('div');
    div.className = 'video-card';
    div.innerHTML = `
      <div class="video-thumb">
        <img src="thumbnails/${v.id}.jpg" alt="${v.title}">
        <div class="overlay">
          <button class="play-btn" data-id="${v.id}">▶</button>
        </div>
      </div>
      <div class="video-info">
        <h4>${v.title}</h4>
        <p>${v.desc || "Recording available"}</p>
      </div>
    `;
    past.appendChild(div);
  });

  past.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vid = data.pastVideos.find(x => x.id == btn.dataset.id);
      showModal(`
        <h3>${vid.title}</h3>
        <video controls autoplay width="100%">
          <source src="videos/${vid.id}.mp4" type="video/mp4">
        </video>
      `);
    });
  });

  // Render upcoming
  const up = document.getElementById('upcoming-sessions');
  up.innerHTML = '';
  data.events.forEach(ev => {
    const d = new Date(ev.date);
    const diff = d - new Date();
    if (diff > 0) {
      const div = document.createElement('div');
      div.className = 'event-card';
      div.innerHTML = `
        <h4>${ev.title}</h4>
        <div>${d.toLocaleString()}</div>
        <div data-ts="${ev.date}" class="countdown-wrap">
          Starts in: <span class="countdown">--</span>
        </div>
      `;
      up.appendChild(div);
    }
  });

  updateCountdowns();
}

  /* ---------- Gallery ---------- */
  function renderGallery(){
    const wrap=document.getElementById('gallery-grid'); wrap.innerHTML='';
    data.gallery.forEach(g=>{
      const div=document.createElement('div'); div.className='gallery-item';
      div.innerHTML=`<div>${g.title}</div>`;
      div.addEventListener('click', ()=> {
        showModal(`<h3>${g.title}</h3><div style="height:300px;background:#eef2f9;border-radius:8px;display:flex;align-items:center;justify-content:center">Image preview (add actual images later)</div><div class="form-row"><button id="close-g">Close</button></div>`);
        document.getElementById('close-g').addEventListener('click', closeModal);
      });
      wrap.appendChild(div);
    });
  }

  /* ---------- Forum ---------- */
  document.getElementById('thread-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const title=document.getElementById('thread-title').value.trim();
    const body=document.getElementById('thread-body').value.trim();
    if(!title||!body) return;
    const id = (data.threads?Math.max(...data.threads.map(t=>t.id),0)+1:1);
    data.threads = data.threads || [];
    data.threads.unshift({id,title,body,by:'Student',created:new Date().toISOString(),replies:[],votes:0});
    save(); renderThreads();
    e.target.reset();
  });

  document.getElementById('clear-threads').addEventListener('click', ()=>{
    const pwd = prompt('Admin password to clear all threads (for demo, enter: admin123)');
    if(pwd==='admin123'){ data.threads=[]; save(); renderThreads(); alert('All threads cleared'); }
    else alert('Wrong password.');
  });

  function renderThreads(){
    const wrap=document.getElementById('threads-list'); wrap.innerHTML='';
    const list = data.threads || [];
    if(!list.length) { wrap.innerHTML='<div class="card">No threads yet.</div>'; return; }
    list.forEach(t=>{
      const card=document.createElement('div'); card.className='card thread-card';
      card.innerHTML=`<strong>${t.title}</strong><div class="kv">by ${t.by} • ${new Date(t.created).toLocaleString()}</div>
        <p>${t.body}</p>
        <div class="form-row"><button class="reply-btn" data-id="${t.id}">Reply</button><button class="vote-btn" data-id="${t.id}">▲ ${t.votes||0}</button></div>`;
      wrap.appendChild(card);
    });
    wrap.querySelectorAll('.reply-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = Number(btn.dataset.id);
        const reply = prompt('Write your reply:');
        if(reply){
          const thread = data.threads.find(x=>x.id===id);
          thread.replies.push({by:'Student',text:reply,when:new Date().toISOString()});
          save(); renderThreads();
        }
      });
    });
    wrap.querySelectorAll('.vote-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = Number(btn.dataset.id);
        const thread = data.threads.find(x=>x.id===id);
        thread.votes = (thread.votes||0)+1;
        save(); renderThreads();
      });
    });
  }

  /* ---------- Chat Rooms (BroadcastChannel) ---------- */

function renderMessage(m) {
  const div = document.createElement('div');
  div.className = 'msg ' + (m.by === 'You' ? 'you' : 'other');
  div.innerHTML = `
    <div class="bubble">
      <div class="text">${m.text}</div>
      <div class="meta">${m.by} • ${new Date(m.when).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
    </div>`;
  return div;
}

function renderChat() {
  const wrap = document.getElementById('chat-messages');
  wrap.innerHTML = '';
  const key = chatState.mode === 'branch' ? `branch:${chatState.branch}` : `year:${chatState.year}`;
  const list = chatState.messages.filter(m => m.type === key);

  if (!list.length) {
    wrap.innerHTML = '<div class="kv">No messages yet</div>';
  } else {
    list.forEach(m => wrap.appendChild(renderMessage(m)));
  }

  // smooth scroll to latest
  wrap.scrollTo({ top: wrap.scrollHeight, behavior: "smooth" });
}

  /* ---------- Chatbot (simple rules) ---------- */
  function botReply(message){
    const m = message.toLowerCase();
    if(m.includes('mentorship')||m.includes('mentor')) return 'To see mentorship sessions, go to the Mentorships card on the Dashboard or the Alumni Network section.';
    if(m.includes('internship')||m.includes('placement')) return 'Check Internships section. Click Apply and fill the form to save your application locally.';
    if(m.includes('alumni')) return 'Use Alumni Network -> search by branch/year to find alumni. Click View to connect.';
    if(m.includes('webinar')) return 'Webinars are listed under Blogs & Webinars. Click Register to sign up.';
    if(m.includes('chat')) return 'Open Chat Rooms, choose branch or year and send a message. For real-time across devices, integrate Socket.IO / Firebase.';
    if(m.includes('schedule')||m.includes('event')) return 'Events & schedules are on Dashboard → Upcoming Events. Click Details for more info.';
    return 'Sorry — try: mentorship, internship, alumni, webinar, schedule, chat';
  }
  document.getElementById('bot-send').addEventListener('click', ()=> {
    const input = document.getElementById('bot-input'); const text=input.value.trim();
    if(!text) return;
    appendBotMessage('You', text);
    setTimeout(()=> { appendBotMessage('Bot', botReply(text)); }, 500);
    input.value='';
  });
  function appendBotMessage(by,text){
    const wrap=document.getElementById('bot-messages'); const d=document.createElement('div'); d.className='msg';
    d.innerHTML=`<strong>${by}</strong> <div class="kv">${text}</div>`; wrap.appendChild(d); wrap.scrollTop=wrap.scrollHeight;
  }

  /* ---------- Modal helpers ---------- */
  function showModal(html){
    const root = document.getElementById('modals');
    root.innerHTML = `<div class="modal"><div class="modal-body">${html}</div></div>`;
    // close handlers inside modal if id used
    root.querySelectorAll('#modal-close, #close-modal, #closeb').forEach(b=>b.addEventListener('click', closeModal));
    root.querySelectorAll('.modal').forEach(m=> m.addEventListener('click', (e)=>{ if(e.target===m) closeModal(); }));
  }
  function closeModal(){ document.getElementById('modals').innerHTML = ''; }

  /* ---------- init render ---------- */
  function init(){
    data = storage.get('hc_data', sample); // load
    renderAnnouncements();
    renderEvents();
    renderMentorships();
    renderMyRsvps();
    populateFilters();
    renderAlumniList({});
    renderInternships();
    renderMyApplications();
    renderBlogs();
    renderWebinars();
    renderProjects();
    renderVideos();
    renderGallery();
    renderThreads();
    renderChat();
  }
  init();

  // small UI polishes
  setInterval(()=>{ renderAnnouncements(); renderEvents(); }, 60000);

});
