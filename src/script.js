import { createApp } from "vue";
import { setupJquery } from './myjquery';


const app = createApp({

    // initiate var here
    data() {
        return {
            visibleNote: false,
            ascOrder: false,
            notes: [],
            addNote: {
                id: '',
                title: '',
                content: '',
                date: this.get_date(),
                status: false,
                timestamp: Date.now()
            },
            getNote: [], // untuk view note berdasarkan ID
            autoSaved: false
        }
    },

    // function here
    methods: {

        get_date() {
            let currentTime = new Date();
            let year = currentTime.getFullYear();
            let month = ('0' + (currentTime.getMonth() + 1)).slice(-2);
            let date = ('0' + currentTime.getDate()).slice(-2);
            let hours = ('0' + currentTime.getHours()).slice(-2);
            let minutes = ('0' + currentTime.getMinutes()).slice(-2);
            let formattedTimestamp = `${date}-${month}-${year} ${hours}:${minutes}`;

            return formattedTimestamp;
        },

        cek(note) {
            note.status = !note.status; // Pembalikan status buku
            let tercek = this.notes.filter(nt => nt.status).length;
            if (tercek == this.notes.length) {
                // alert();
            }
            this.simpanKeLocalStorage(); // Panggil metode untuk menyimpan ke local storage
        },
        simpanKeLocalStorage() {
            localStorage.setItem('noteapp', JSON.stringify(this.notes)); // Simpan items ke local storage
        },
        submitForm() {
            let notes = JSON.parse(localStorage.getItem('noteapp')) || [];

            if (notes) {
                let newId = Math.random().toString(36).substr(2, 6);
                this.addNote.id = newId;

                notes.push(this.addNote);

                localStorage.setItem('noteapp', JSON.stringify(notes));

                notes.sort((a, b) => b.timestamp - a.timestamp);
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
                date: this.get_date(),
                status: false,
                timestamp: Date.now(),
            };
        },

        sortedNotes() {
            let notes2 = [...this.notes];

            if (this.ascOrder) {
                notes2.sort((a, b) => a.timestamp - b.timestamp);
            } else {
                notes2.sort((a, b) => b.timestamp - a.timestamp);
            }

            return this.notes = notes2;
        },

        sortit() {
            this.ascOrder = !this.ascOrder;
            this.sortedNotes();
        },

        scrollUp() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },

        showNote(id) {
            this.visibleNote = !this.visibleNote;

            if (this.visibleNote) { // cek apakah masih menampilkan suatu note
                // Mencari catatan berdasarkan ID
                let foundNote = this.notes.find(note => note.id === id);

                // Jika catatan ditemukan
                if (foundNote) {
                    this.getNote = foundNote;
                    console.log(`mengulik -> ${this.getNote.title}`);
                } else {
                    console.log(`Catatan dengan ID ${id} tidak ditemukan`);
                }
            } else {
                this.getNote = [];
            }

        },

        edited(id) {
            this.autoSaved = true;

            let foundNote = this.notes.findIndex(note => note.id === id);

            // Jika catatan ditemukan
            if (foundNote !== -1) {
                this.notes[foundNote].title = this.getNote.title;
                this.notes[foundNote].content = this.getNote.content;

                localStorage.setItem('noteapp', JSON.stringify(this.notes));
            } else {
                console.log(`Catatan dengan ID ${id} tidak ditemukan`);
            }

        },

        visibleTxtInfo() {
            this.autoSaved = false;
            setupJquery();
        },

        deleteNote(id) {
            let foundNote = this.notes.findIndex(note => note.id === id);

            // Jika catatan ditemukan
            if (foundNote !== -1) {
                this.notes.splice(foundNote, 1);

                localStorage.setItem('noteapp', JSON.stringify(this.notes));
            } else {
                console.log(`Catatan dengan ID ${id} tidak ditemukan`);
            }
        }

    },

    // take a data from local storage
    mounted() {
        const get_notes = JSON.parse(localStorage.getItem('noteapp'));
        if (get_notes) {
            get_notes.sort((a, b) => b.timestamp - a.timestamp);
            this.notes = get_notes;
        } else {
            this.notes = [];
        }

        setupJquery();

    },

    computed: {
        totalcek() {
            let tercek = this.notes.filter(note => note.status).length;
            let total = `${tercek} / ${this.notes.length}`;
            return total;
        }
    }


})


app.mount("#container-wrap")