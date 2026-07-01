/* ==========================================================
   1. GLOBAL VARIABLES
========================================================== */

// Notes Loaded From Server
let notes = [];

// Current Editing Index
let editIndex = -1;

// Button Text
const BTN_ADD = "Add";
const BTN_UPDATE = "Update";

// API URL
const API_URL = "http://localhost:3000/notes";

// DOM Elements
const cmdInput = document.getElementById("cmd");
const descInput = document.getElementById("desc");
const saveBtn = document.getElementById("saveBtn");
const tbody = document.getElementById("tbody");
const search = document.getElementById("search");
const formCard = document.getElementById("formCard");


/* ==========================================================
   2. SERVER FUNCTIONS
========================================================== */

// Load All Notes
async function loadNotes(){

    try{

        const response = await fetch(API_URL);

        notes = await response.json();

        render();

    }

    catch(error){

        console.error(error);

    }

}


/* ==========================================================
   3. FORM
========================================================== */

// Reset Form
function clearForm(){

    cmdInput.value = "";
    descInput.value = "";

    editIndex = -1;

    saveBtn.innerText = BTN_ADD;

    cmdInput.focus();

}


// Add / Update Note
async function addData(){

    const cmd = cmdInput.value.trim();
    const desc = descInput.value.trim();

    if(!cmd || !desc){

        Swal.fire({

            title:"Missing Information",

            text:"Please fill all fields.",

            icon:"warning",

            width:300,

            background:"rgba(20,25,40,.82)",

            color:"#fff",

            confirmButtonColor:"#3b82f6",

            customClass:{
                popup:"delete-popup"
            }

        });

        return;

    }

        /* ==========================
       ADD NEW NOTE
    ========================== */

    if(editIndex === -1){

        await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                cmd,
                desc

            })

        });

    }

    /* ==========================
       UPDATE NOTE
    ========================== */

    else{

        await fetch(`${API_URL}/${notes[editIndex].id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                cmd,
                desc

            })

        });

    }

    // Reload Notes From Server

    await loadNotes();

    // Reset Form

    clearForm();

}

/* ==========================================================
   4. EDIT FUNCTION
========================================================== */

function edit(index){

    cmdInput.value = notes[index].cmd;

    descInput.value = notes[index].desc;

    editIndex = index;

    saveBtn.innerText = BTN_UPDATE;

    formCard.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

    cmdInput.focus();

}


/* ==========================================================
   5. DELETE FUNCTION
========================================================== */

function del(index){

    Swal.fire({

        title:"Delete Command?",

        text:"This action cannot be undone.",

        icon:"warning",

        width:300,

        background:"rgba(20,25,40,.82)",

        color:"#fff",

        backdrop:"rgba(0,0,0,.45)",

        showCancelButton:true,

        confirmButtonText:"Delete",

        cancelButtonText:"Cancel",

        confirmButtonColor:"#ef4444",

        cancelButtonColor:"#334155",

        reverseButtons:true,

        customClass:{
            popup:"delete-popup"
        }

    }).then(async(result)=>{

        if(!result.isConfirmed) return;

        await fetch(`${API_URL}/${notes[index].id}`,{

            method:"DELETE"

        });

        if(editIndex === index){

            clearForm();

        }

        await loadNotes();

    });

}

/* ==========================================================
   6. RENDER TABLE
========================================================== */

function render(){

    const keyword = search.value.toLowerCase();

    let html = "";

    let found = false;

    notes.forEach((note,index)=>{

        if(

            note.cmd.toLowerCase().includes(keyword) ||

            note.desc.toLowerCase().includes(keyword)

        ){

            found = true;

            html += `
<tr>

<td>
<code>${note.cmd}</code>
</td>

<td>
${note.desc}
</td>

<td class="action-cell">

<button
class="icon-btn edit"
onclick="edit(${index})"
title="Edit">

<i class="fa-solid fa-pen-to-square"></i>

</button>

<button
class="icon-btn delete"
onclick="del(${index})"
title="Delete">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>
`;

        }

    });

    if(!found){

        html = `
<tr>

<td colspan="3" class="empty">

<i
class="fa-regular fa-folder-open"
style="font-size:26px;display:block;margin-bottom:10px;">
</i>

No Commands Found

</td>

</tr>
`;

    }

    tbody.innerHTML = html;

}


/* ==========================================================
   7. KEYBOARD SHORTCUTS
========================================================== */

cmdInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        descInput.focus();

    }

});

descInput.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="Enter"){

        e.preventDefault();

        addData();

    }

});


/* ==========================================================
   8. PDF EXPORT
========================================================== */

function downloadPDF(){

    if(notes.length===0){

        Swal.fire({

            title:"No Data",

            text:"There are no commands to export.",

            icon:"info",

            width:300,

            background:"rgba(20,25,40,.82)",

            color:"#fff",

            confirmButtonColor:"#3b82f6",

            customClass:{
                popup:"delete-popup"
            }

        });

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const rows = notes.map((item,index)=>[
        index+1,
        item.cmd,
        item.desc
    ]);

    doc.setFont("helvetica","bold");
    doc.setFontSize(20);
    doc.text("OS Command Notes",14,18);

    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.setTextColor(120);

    doc.text(

        `Generated by AIUB_OSLaB: ${new Date().toLocaleString()}`,

        14,

        24

    );

    doc.autoTable({

        startY:30,

        head:[
            ["#","Command","Description"]
        ],

        body:rows,

        theme:"striped",

        headStyles:{
            fillColor:[31,41,55],
            textColor:[255,255,255]
        },

        styles:{
            fontSize:10,
            cellPadding:4
        },

        alternateRowStyles:{
            fillColor:[245,245,245]
        },

        columnStyles:{
            0:{cellWidth:12},
            1:{cellWidth:60},
            2:{cellWidth:"auto"}
        }

    });

    doc.save("OS_Command_Notes.pdf");

}


/* ==========================================================
   9. INITIAL LOAD
========================================================== */

loadNotes();

