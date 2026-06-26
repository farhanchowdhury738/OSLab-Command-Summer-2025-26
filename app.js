/* ==========================================================
   1. GLOBAL VARIABLES
   ========================================================== */

// Local Storage Data
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Current Editing Index
let editIndex = -1;

// Button Text
const BTN_ADD = "Add";
const BTN_UPDATE = "Update";

// DOM Elements
const cmdInput = document.getElementById("cmd");
const descInput = document.getElementById("desc");
const saveBtn = document.getElementById("saveBtn");
const tbody = document.getElementById("tbody");
const search = document.getElementById("search");
const formCard = document.getElementById("formCard");


/* ==========================================================
   2. LOCAL STORAGE
   ========================================================== */

// Save Notes
const save = () => {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

};


/* ==========================================================
   3. FORM FUNCTIONS
   ========================================================== */

// Reset Form
const clearForm = () => {

    cmdInput.value = "";
    descInput.value = "";

    editIndex = -1;

    saveBtn.innerText = BTN_ADD;

    cmdInput.focus();

};


// Add / Update Command
const addData = () => {

    const cmd = cmdInput.value.trim();
    const desc = descInput.value.trim();

    if (!cmd || !desc) {

        Swal.fire({

            title: "Missing Information",
            text: "Please fill all fields.",
            icon: "warning",

            width: 300,

            background: "rgba(20,25,40,.82)",
            color: "#fff",

            confirmButtonText: "OK",

            confirmButtonColor: "#3b82f6",

            customClass: {
                popup: "delete-popup"
            }

        });

        return;

    }

    // New Command
    if (editIndex === -1) {

        notes.unshift({
            cmd,
            desc
        });

    }

    // Update Existing Command
    else {

        notes[editIndex] = {
            cmd,
            desc
        };

    }

    save();

    clearForm();

    render();

};

/* ==========================================================
   4. EDIT FUNCTION
   ========================================================== */

// Load Selected Data Into Form
const edit = (index) => {

    cmdInput.value = notes[index].cmd;
    descInput.value = notes[index].desc;

    editIndex = index;

    saveBtn.innerText = BTN_UPDATE;

    formCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    cmdInput.focus();

};


/* ==========================================================
   5. DELETE FUNCTION
   ========================================================== */

// Delete Selected Command
const del = (index) => {

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

        if(!result.isConfirmed) return;

        notes.splice(index,1);

        save();

        if(editIndex === index){

            clearForm();

        }

        render();

    });

};


/* ==========================================================
   6. TABLE RENDER
   ========================================================== */

// Render All Commands
const render = () => {

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

<td
colspan="3"
class="empty">

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

};

/* ==========================================================
   7. KEYBOARD SHORTCUTS
   ========================================================== */

// Press Enter → Move to Description
cmdInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        descInput.focus();

    }

});

// Press Ctrl + Enter → Save
descInput.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="Enter"){

        e.preventDefault();

        addData();

    }

});


/* ==========================================================
   8. PDF EXPORT
   ========================================================== */

// Download Notes as PDF
const downloadPDF = () => {

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

    // Title
    doc.setFont("helvetica","bold");
    doc.setFontSize(20);
    doc.text("OS Command Notes",14,18);

    // Subtitle
    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        14,
        24
    );

    // Table
    doc.autoTable({

        startY:30,

        head:[
            ["#","Command","Description"]
        ],

        body:rows,

        theme:"striped",

        headStyles:{
            fillColor:[31,41,55],
            textColor:[255,255,255],
            fontStyle:"bold"
        },

        styles:{
            fontSize:10,
            cellPadding:4,
            lineColor:[220,220,220],
            lineWidth:.2
        },

        alternateRowStyles:{
            fillColor:[245,245,245]
        },

        columnStyles:{
            0:{cellWidth:12},
            1:{cellWidth:60},
            2:{cellWidth:"auto"}
        },

        didDrawPage:function(){

            doc.setFontSize(9);

            doc.setTextColor(120);

            doc.text(

                "Created by Farhan",

                14,

                doc.internal.pageSize.height-10

            );

            doc.text(

                "Page " + doc.internal.getNumberOfPages(),

                doc.internal.pageSize.width-30,

                doc.internal.pageSize.height-10

            );

        }

    });

    doc.save("OS_Command_Notes.pdf");

};


/* ==========================================================
   9. INITIAL LOAD
   ========================================================== */

// Load Commands
render();





