export async function getRooms() {
  const response = await fetch("http://localhost:8080/api/user/20Cents/rooms", {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    // body: JSON.stringify({user: data})
  });
  return await response.json();
}

export async function getMembers(roomId) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId + "/members", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs"
    }
  });
  return await response.json();
}

export async function getMessages(roomId) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs"
    }
  });
  return await response.json();
}

export async function promoteUser(roomId, usernameToPromote) {
  const response = await fetch("http://localhost:8080/api/rooms/" + roomId + "/promote", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpbmNlbnQuZmVycmFyZEBlcGl0ZWNoLmV1IiwidXNlcm5hbWUiOiIyMENlbnRzIn0.ED-9KBS0grztWGcZvU1yZIzaZ9NiLBqHWDor7bznEJs"
    },
    body : JSON.stringify({
      username: usernameToPromote
    })
  });
  return await response.json();
}