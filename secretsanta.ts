class Participant {
    constructor(public name: string) {}
}

class Assignment {
    constructor(public participant1: Participant, public participant2: Participant) {}
}

class Group {
    participants: Participant[] = [];
    assignments: Assignment[] = [];
   
    constructor(public name: string) {
        this.name = name;
    }
}

class SecretSantaManager {
    static groups: Group[] = [];
    
    // Add a new participant to a group
    static addParticipant(name: string, group: Group): void {
        if (group.participants.find(participant => participant.name === name)) {
            console.log("Already in Group");
        } else {
            group.participants.push(new Participant(name));
        }
    }

    // Create a new group
    static createGroup(name: string): Group {
        const newGroup = new Group(name);
        this.groups.push(newGroup);
        return newGroup;
    }

    // Shuffle the participants and assign Secret Santa partners
    static draw(group: Group): void {
        const shuffledParticipants = [...group.participants].sort(() => Math.random() - 0.5);
        group.assignments = []; // Reset assignments
        for (let i = 0; i < group.participants.length; i++) {
            const participant1 = group.participants[i];
            const participant2 = shuffledParticipants[i];
            group.assignments.push(new Assignment(participant1, participant2));
        }
    }

    // Get the assignments of a group
    static getAssignments(group: Group): Assignment[] {
        return group.assignments;
    }

    // Get the participants of a group
    static getParticipants(group: Group): Participant[] {
        return group.participants;
    }
}

// Simple UI for interaction

function createGroupUI() {
    const groupNameInput = document.getElementById('group-name') as HTMLInputElement;
    const groupName = groupNameInput.value;
    const group = SecretSantaManager.createGroup(groupName);
    displayGroupInfo(group);
}

function addParticipantUI() {
    const participantNameInput = document.getElementById('participant-name') as HTMLInputElement;
    const participantName = participantNameInput.value;
    const groupSelect = document.getElementById('group-select') as HTMLSelectElement;
    const groupName = groupSelect.value;

    const group = SecretSantaManager.groups.find(group => group.name === groupName);
    if (group) {
        SecretSantaManager.addParticipant(participantName, group);
        displayGroupInfo(group);
    }
}

function drawSecretSantaUI() {
    const groupSelect = document.getElementById('group-select') as HTMLSelectElement;
    const groupName = groupSelect.value;

    const group = SecretSantaManager.groups.find(group => group.name === groupName);
    if (group) {
        SecretSantaManager.draw(group);
        displayAssignments(group);
    }
}

function displayGroupInfo(group: Group) {
    const participantsList = document.getElementById('participants-list') as HTMLUListElement;
    participantsList.innerHTML = '';
    group.participants.forEach(participant => {
        const listItem = document.createElement('li');
        listItem.textContent = participant.name;
        participantsList.appendChild(listItem);
    });

    const groupSelect = document.getElementById('group-select') as HTMLSelectElement;
    const option = document.createElement('option');
    option.value = group.name;
    option.textContent = group.name;
    groupSelect.appendChild(option);
}

function displayAssignments(group: Group) {
    const assignmentsList = document.getElementById('assignments-list') as HTMLUListElement;
    assignmentsList.innerHTML = '';
    group.assignments.forEach(assignment => {
        const listItem = document.createElement('li');
        listItem.textContent = `${assignment.participant1.name} -> ${assignment.participant2.name}`;
        assignmentsList.appendChild(listItem);
    });
}

// HTML UI
document.body.innerHTML = `
    <h1>Secret Santa</h1>
    <div>
        <h2>Create Group</h2>
        <input type="text" id="group-name" placeholder="Group Name" />
        <button onclick="createGroupUI()">Create Group</button>
    </div>
    <div>
        <h2>Add Participant</h2>
        <input type="text" id="participant-name" placeholder="Participant Name" />
        <select id="group-select"></select>
        <button onclick="addParticipantUI()">Add Participant</button>
    </div>
    <div>
        <h2>Draw Secret Santa</h2>
        <select id="group-select-draw"></select>
        <button onclick="drawSecretSantaUI()">Draw</button>
    </div>
    <div>
        <h3>Participants</h3>
        <ul id="participants-list"></ul>
    </div>
    <div>
        <h3>Assignments</h3>
        <ul id="assignments-list"></ul>
    </div>
`;
