declare let $: any;

export function loading() {
    $('.loader').fadeIn('slow');
}

export function unloading() {
    $('.loader').fadeOut('slow');
}
