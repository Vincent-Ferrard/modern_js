export default async function registerService(email, name, password) {
    const response = await fetch('http://localhost:8080/api/user/signup', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          email: email,
          name: name,
          password: password,
        })
    });
    return await response.json();
}