export async function getUserData() {
  const response = await fetch("http://localhost:8080/api/user/data", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"),
    },
  });
  return await response.json();
}

export async function getRooms(username) {
  const response = await fetch("http://localhost:8080/api/user/" + username + "/rooms", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"),
    },
  });
  return await response.json();
}

export async function removeMember(roomId) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId + "/leave", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"),
    }
  });
  return await response.json();
}

export async function getMembers(roomId) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId + "/members", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"), //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs"
    }
  });
  return await response.json();
}

export async function getMessages(roomId) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"),
    }
  });
  return await response.json();
}

export async function promoteUser(roomId, usernameToPromote) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId + "/promote", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"),
    },
    body : JSON.stringify({
      username: usernameToPromote
    })
  });
  return await response.json();
}

export async function inviteUser(roomId, input) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId + "/members/add", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"),
    },
    body : JSON.stringify({
      input: input
    })
  });
  return await response.json();
}

export async function createRoom(name) {
  const response = await fetch("http://localhost:8080/api/rooms/create", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body : JSON.stringify({
      name: name
    })
  });
  return await response.json();
}

export async function acceptInvite(roomId, inviteToken) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId + "/invitation/accept?token=" + inviteToken, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer " + localStorage.getItem("token"),
    }
  });
  return await response.json();
}