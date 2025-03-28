document.getElementById("contatoForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    let nome = document.getElementById("nome").value.trim();
    let email = document.getElementById("email").value.trim();
    let mensagem = document.getElementById("mensagem").value.trim();
    let mensagemSucesso = document.getElementById("mensagemSucesso");
  
    if (nome === "" || email === "" || mensagem === "") {
      alert("Preencha todos os campos!");
      return;
    }
  
    if (!email.includes("@") || !email.includes(".")) {
      alert("Digite um e-mail válido!");
      return;
    }
  
    mensagemSucesso.style.display = "block";
  
    setTimeout(() => {
      mensagemSucesso.style.display = "none";
      document.getElementById("contatoForm").reset();
    }, 3000);
  });
  