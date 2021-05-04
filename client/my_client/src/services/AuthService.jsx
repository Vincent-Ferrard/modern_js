export async function loginService(emailAdress, password) {
    const response = await fetch("http://localhost:8080/api/user/signin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({
        email: emailAdress,
        password: password,
      })
    });
    return await response.json();
  }