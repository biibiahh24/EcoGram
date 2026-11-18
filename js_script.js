// Interações locais da interface original EcoGram/Sustagram.
// Não dependem de back-end e são reiniciadas ao atualizar a página.
function like(button) {
  const pressed = button.getAttribute("aria-pressed") === "true";
  const selected = !pressed;
  button.setAttribute("aria-pressed", String(selected));
  button.style.color = selected ? "#65ff94" : "";
  const count = button.closest(".post")?.querySelector(".likes-count");
  if (count) count.textContent = selected ? "1 curtida" : "0 curtidas";
}
function toggleComment(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  const showing = panel.style.display === "block";
  panel.style.display = showing ? "none" : "block";
  if (!showing) panel.querySelector("input")?.focus();
}
function sendComment(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  const input = panel.querySelector("input");
  const value = input?.value.trim();
  if (!value) return;
  const message = document.createElement("p");
  message.textContent = "Você: " + value;
  message.className = "comment-line";
  panel.insertBefore(message, input);
  input.value = "";
}
async function sharePost(button) {
  const url = window.location.href;
  if (navigator.share) {
    try { await navigator.share({ title: "Sustagram", url }); }
    catch(error) { if (error.name !== "AbortError") console.warn(error); }
  } else if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(url);
    button.setAttribute("title", "Link copiado");
  } else {
    button.setAttribute("title", "Copie o endereço desta página para compartilhar");
  }
}
function openStory(src, name) {
  const overlay = document.createElement("div");
  overlay.className = "story-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Story de " + name);
  const content = document.createElement("div");
  content.className = "story-modal";
  const image = document.createElement("img");
  image.src = src;
  image.alt = "Imagem do story de " + name;
  const caption = document.createElement("p");
  caption.textContent = name;
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Fechar";
  close.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", event => { if (event.target === overlay) overlay.remove(); });
  const onKey = event => { if (event.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", onKey); } };
  document.addEventListener("keydown", onKey);
  content.append(image, caption, close);
  overlay.append(content);
  document.body.append(overlay);
  close.focus();
}
