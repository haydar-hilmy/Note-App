import $ from 'jquery';

export function setupJquery() {
    $(document).ready(function () {
        $("#form_wrap").hide();
        $("#addBtn").click(function () {
            $("#form_wrap").slideToggle(300);
        });
        $("#formAddNote").submit(function () {
            $("#form_wrap").slideToggle(200);
        });
    });
}