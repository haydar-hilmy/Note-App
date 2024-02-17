import { createApp } from "vue";
import $ from 'jquery';

$(document).ready(function () {
    $("#form_wrap").hide();
    $("#addBtn").click(function () {
        $("#form_wrap").slideToggle(300);
    });
    $("#formAddNote").submit(function(){
        $("#form_wrap").slideToggle(200);
    });
});


function get_date() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = ('0' + (currentTime.getMonth() + 1)).slice(-2);
    const date = ('0' + currentTime.getDate()).slice(-2);
    const hours = ('0' + currentTime.getHours()).slice(-2);
    const minutes = ('0' + currentTime.getMinutes()).slice(-2);
    const formattedTimestamp = `${date}-${month}-${year} ${hours}:${minutes}`;

    return formattedTimestamp;
}


const app = createApp({

    // initiate var here
    data() {
        return {
            ascOrder: false,
            notes: [],
            addNote: {
                id: '',
                title: '',
                content: '',
                date: get_date(),
                status: false
            }
        }
    },

    // function here
    methods: {
        cek(note) {
            note.status = !note.status; // Pembalikan status buku
            this.simpanKeLocalStorage(); // Panggil metode untuk menyimpan ke local storage
        },
        simpanKeLocalStorage() {
            localStorage.setItem('noteapp', JSON.stringify(this.notes)); // Simpan items ke local storage
        },
        submitForm() {
            let notes = JSON.parse(localStorage.getItem('noteapp')) || [];

            if (notes) {
                let lastNote = notes[notes.length - 1];
                let newId = lastNote ? parseInt(lastNote.id) + 1 : 1;
                this.addNote.id = newId.toString();

                notes.push(this.addNote);

                localStorage.setItem('noteapp', JSON.stringify(notes));

                notes.sort((a, b) => b.id - a.id);
                this.notes = notes;

                this.resetForm();
            } else {
                notes = [this.addNote];
            }
        },

        resetForm() {
            // Reset nilai input form ke nilai awal
            this.addNote = {
                id: '',
                title: '',
                content: '',
                date: '',
                status: false
            };
        },

        sortedNotes(){
            let notes2 = [...this.notes];

            if (this.ascOrder) {
                notes2.sort((a, b) => {
                  return a.id.localeCompare(b.id);
                });
              } else {
                notes2.sort((a, b) => {
                  return b.id.localeCompare(a.id);
                });
              }

              return this.notes = notes2;
        },

        sortit(){
            this.ascOrder = !this.ascOrder;
            this.sortedNotes();
        }

    },

    // take a data from local storage
    mounted() {
        const get_notes = JSON.parse(localStorage.getItem('noteapp'));
        get_notes.sort((a, b) => b.id - a.id);
        this.notes = get_notes ? get_notes : [];
    },
    
    computed: {
        totalcek(){
            let tercek = this.notes.filter(note => note.status).length;
            let total = `${tercek} / ${this.notes.length}`;
            return total;
        }
    }


})

app.mount("#container")