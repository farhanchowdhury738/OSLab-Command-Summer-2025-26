let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = -1;

const cmdInput = document.getElementById("cmd");
const descInput = document.getElementById("desc");
const saveBtn = document.getElementById("saveBtn");
const tbody = document.getElementById("tbody");
const search = document.getElementById("search");

function save() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function clearForm() {
    cmdInput.value = "";
    descInput.value = "";
    editIndex = -1;
    saveBtn.innerText = "Add";
    cmdInput.focus();
}

function addData() {

    const cmd = cmdInput.value.trim();
    const desc = descInput.value.trim();

    if (cmd === "" || desc === "") {
        alert("Please fill all fields.");
        return;
    }

    if (editIndex === -1) {

        notes.unshift({
            cmd,
            desc
        });

    } else {

        notes[editIndex] = {
            cmd,
            desc
        };

    }

    save();
    clearForm();
    render();

}

function edit(i) {

    cmdInput.value = notes[i].cmd;
    descInput.value = notes[i].desc;

    editIndex = i;

    saveBtn.innerText = "Update";

    document.getElementById("formCard").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    cmdInput.focus();

}

function del(i){

    Swal.fire({
        title: "Delete Command?",
        text: "This action cannot be undone.",
        icon: "warning",

        width: 300,

        background: "rgba(20,25,40,.82)",
        color: "#fff",

        backdrop: "rgba(0,0,0,.45)",

        showCancelButton: true,

        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",

        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#334155",

        reverseButtons: true,

        customClass:{
            popup:"delete-popup"
        }

    }).then((result)=>{

        if(result.isConfirmed){

            notes.splice(i,1);

            save();

            if(editIndex===i){
                clearForm();
            }

            render();

        }

    });

}

function render() {

    const keyword = search.value.toLowerCase();

    tbody.innerHTML = "";

    let count = 0;

    notes.forEach((note, index) => {

        if (
            note.cmd.toLowerCase().includes(keyword) ||
            note.desc.toLowerCase().includes(keyword)
        ) {

            count++;

            tbody.innerHTML += `
<tr>

<td><code>${note.cmd}</code></td>

<td>${note.desc}</td>

<td class="action-cell">

<button class="icon-btn edit" onclick="edit(${index})" title="Edit">
<i class="fa-solid fa-pen-to-square"></i>
</button>

<button class="icon-btn delete" onclick="del(${index})" title="Delete">
<i class="fa-solid fa-trash"></i>
</button>

</td>

</tr>
`;

        }

    });

    if (count === 0) {

        tbody.innerHTML = `
<tr>
<td colspan="3" class="empty">
No commands found.
</td>
</tr>
`;

    }

}

cmdInput.addEventListener("keydown", function(e) {

    if (e.key === "Enter") {
        e.preventDefault();
        descInput.focus();
    }

});

descInput.addEventListener("keydown", function(e) {

    if (e.ctrlKey && e.key === "Enter") {
        addData();
    }

});

render();