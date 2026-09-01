export default (password: string) => {
  if (!/^(?=.*\d)(?=.*[^a-zA-Z0-9]).*$/.test(password)) {
    throw new Error(
      "Senha precisa ter pelo menos um número e um caractere especial!",
    );
  }
};
