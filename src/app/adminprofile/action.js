import axios from "axios";

export async function userData() {
    const id = await axios.get('api/auth/user').then(res=>res.data.userId);
    const user = await axios.get(`/api/users/${id}`)
    console.log(user.data);
    return user.data;
}

export async function updateUser(userData) {
    const id = await axios.get('api/auth/user').then(res=>res.data.userId);
    const res = await axios.patch('api/users/' + id, userData);
}