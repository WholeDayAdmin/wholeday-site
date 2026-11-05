// Wholeday waitlist – sign-up form
  // Your Supabase project – the publishable key is safe to use in a web page.
  // The waitlist table only allows adding an email; nobody can read the list from here.
  const SUPABASE_URL = "https://dpevsbvinezpgzrrmpyu.supabase.co";
  const SUPABASE_KEY = "sb_publishable_61s3j0erRxndo0ddosqCEQ_RzDqfe5l";

  const ref = (new URLSearchParams(location.search).get("ref") || document.referrer.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] || "direct").slice(0, 40);
  const okEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;
  const headers = { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "Content-Type": "application/json" };

  function thanks(box, email) {
    box.innerHTML = `<div class="done"><b>You're on the list 🎉</b>We'll email <strong></strong> as soon as Wholeday is on the App Store. Tell a friend who needs their life sorting!</div>`;
    box.querySelector("strong").textContent = email;
    try { localStorage.setItem("wd_waitlist", email); } catch {}
  }

  document.querySelectorAll(".signup").forEach((box) => {
    const form = box.querySelector("form"), msg = box.querySelector(".msg"), btn = form.querySelector("button");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.email.value.trim().toLowerCase();
      if (form.company.value) return thanks(box, email); // a bot filled the hidden box
      if (!okEmail(email)) { msg.className = "msg err"; msg.textContent = "That email doesn't look quite right."; form.email.focus(); return; }
      btn.disabled = true; const label = btn.textContent; btn.textContent = "Adding you…"; msg.textContent = "";
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, { method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ email, source: ref }) });
        if (res.ok || res.status === 409) { document.querySelectorAll(".signup").forEach((b) => thanks(b, email)); return; } // 409 = already on the list
        throw new Error(String(res.status));
      } catch {
        msg.className = "msg err"; msg.textContent = "Sorry, that didn't work – please try again in a moment.";
        btn.disabled = false; btn.textContent = label;
      }
    });
  });

  // Already signed up on this device? Show the thank-you straight away.
  try { const saved = localStorage.getItem("wd_waitlist"); if (saved) document.querySelectorAll(".signup").forEach((b) => thanks(b, saved)); } catch {}

  // Show how many people have joined, once it's a number worth showing.
  fetch(`${SUPABASE_URL}/rest/v1/rpc/waitlist_count`, { method: "POST", headers, body: "{}" })
    .then((r) => (r.ok ? r.json() : null)).then((n) => {
      const c = document.querySelector(".count"); if (!c || typeof n !== "number" || n < 25) return;
      c.querySelector(".count-text").textContent = `Join ${n.toLocaleString("en-GB")} others on the waiting list`; c.hidden = false;
    }).catch(() => {});

  // Gentle fade-in as sections scroll into view
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
