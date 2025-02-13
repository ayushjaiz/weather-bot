import { User } from "@/types/user"


const API_URL = "https://jsonplaceholder.typicode.com/users"

export async function fetchUsers(): Promise<User[]> {
    const response = await fetch(API_URL)
    if (!response.ok) {
        throw new Error("Failed to fetch users")
    }
    return response.json()
}

export async function updateUser(user: User): Promise<User> {
    const response = await fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
    if (!response.ok) {
        throw new Error("Failed to update user")
    }
    return response.json()
}

