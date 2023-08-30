"use client"

import { useState } from 'react';

interface Room {
    id: number;
    name: string;
    seats: number;
    beds: any;
    guests: any;
}

export default function Home() {
    const [occupiedRooms, setOccupiedRooms] = useState<Room[]>([]);

    const groups = [
        {id: 1, members: ["Ana", "Rodox"]},
        {id: 2, members: ["Melina", "Amaral", "Helena"]},
        {id: 3, members: ["Bruno", "Yara", "Otávio"]},
        {id: 4, members: ["Aline Mazoni", "Léo", "Olivia"]},
        {id: 5, members: ["Dani", "Octávio"]},
        {id: 6, members: ["Aline Carvalho"]},
        {id: 7, members: ["André"]},
        {id: 8, members: ["Grá"]},
        {id: 9, members: ["Jéssica"]}
    ]
    const rooms : Room[] = [
        {id: 1, name: "Quarto Visita", seats: 4, beds: [2, 2], guests: []},
        {id: 2, name: "Quarto Amigos", seats: 4, beds: [2, 1, 1], guests: []},
        {id: 3, name: "Suíte Superior", seats: 3, beds: [2, 1], guests: []},
        {id: 4, name: "Suíte Térrea", seats: 3, beds: [2, 1], guests: []},
        {id: 5, name: "Sala", seats: 4, beds: [1, 1, 1, 1], guests: []}
    ]
    let totalSeats = rooms.reduce((total, room) => total = total + room.seats, 0)
    let totalMembers = groups.reduce((total, group) => total = total + group.members.length, 0)
    let groupIds = groups.map(group => group.id)
    let hostedIds : Array<number> = []

    const arrayCompare = (list1: Array<number>, list2: Array<number>) => list1.concat().sort().join(',') === list2.concat().sort().join(',');

    const buttonHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOccupiedRooms([])
        let occupiedRooms : Room[] = []

        rooms.forEach(room => {
            let triedGroups: Array<number> = []
            let availableSeats: number = room.seats
            let occupiedSeats: number = 0
            let saveCounter : number = 0

            while (availableSeats > 0 && saveCounter < 30) {
                // If all groups are compared to each other, then stop.
                if (arrayCompare(groupIds, triedGroups)) break;
                // If groups are empty
                if (groups.length === 0) break;

                // Pick a random group.
                const groupIndex = Math.floor((Math.random() * groups.length))
                const groupCandidate = groups[groupIndex]
                if (groupCandidate === undefined) break;

                const groupTotalMembers = groupCandidate.members.length;

                // Add GroupID to tried groups
                triedGroups.push(groupCandidate.id)

                // If the room can host this group
                if (availableSeats >= groupTotalMembers) {
                    occupiedSeats += groupTotalMembers
                    availableSeats -= groupTotalMembers
                    room.guests = room.guests.concat(groupCandidate.members)
                    hostedIds = hostedIds.concat(groupCandidate.id)
                    groups.splice(groupIndex, 1)
                }

                saveCounter += 1
            }

            // console.log(room)
            occupiedRooms = occupiedRooms.concat(room)
        })
        setOccupiedRooms(occupiedRooms)
    }

    return (
        <div className="m-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <h3 className="mb-2 text-lg font-semibold">Grupos</h3>
                <ul className="max-w-md space-y-1 list-disc list-inside">
                    { groups.map(group => (
                        <li key={group.id}>
                            {group.members.join(", ")}
                            {" - "}
                            {group.members.length}
                        </li>
                    ))}
                </ul>
                <b>Total de Grupos: {groups.length}</b>
                <br />
                <b>Total de Membros: {totalMembers}</b>
            </div>
            <div>
                <h3 className="mb-2 text-lg font-semibold">Cômodos</h3>
                <ul className="max-w-md space-y-1 list-disc list-inside">
                    { rooms.map(room => (
                        <li key={room.id}>
                            <b>Nome:</b> {room.name}
                            {" - "}
                            <b>Camas:</b> {room.seats} - {room.beds.join("+")}
                        </li>
                    ))}
                </ul>
                <b>Total: {totalSeats}</b>
            </div>
            <div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={buttonHandler}>
                    Sortear
                </button>
                <ul className="max-w-md space-y-1 list-disc list-inside">
                    { occupiedRooms.map(room => (
                        <li key={room.id}>
                            <b>{room.name}</b>
                            ({room.seats})
                            {": "}
                            {room.guests.join(", ")}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
