const xkcdReplaceList = [
    ["witnesses", "these dudes I know"],
    ["allegedly", "kinda probably"],
    ["new study", "tumblr post"],
    ["rebuild", "avenge"],
    ["space", "spaaace"],
    ["google glass", "virtual boy"],
    ["smartphone", "pokédex"],
    ["electric", "atomic"],
    ["senetor", "elf-lord"],
    ["car", "cat"],
    ["election", "eating contest"],
    ["congressional leaders", "river spirits"],
    ["homeland security", "homestar runner"],
    ["could not be reached for comment", "is guilty and everyone knows it"],
    ["debate", "dance-off"],
    ["self driving", "uncontrollably swerving"],
    ["poll", "psychic reading"],
    ["canidate", "airbender"],
    ["drone", "dog"],
    ["vows to", "probably won't"],
    ["at large", "very large"],
    ["successfully", "suddenly"],
    ["expands", "physically expands"],
    ["first degree", "friggin' awful"],
    ["second degree", "friggin' awful"],
    ["third degree", "friggin' awful"],
    ["an unknown number", "like hundreds"],
    ["front runner", "blad runner"],
    ["global", "spherical"],
    ["years", "minutes"],
    ["minutes", "years"],
    ["no indication", "lots of signs"],
    ["urged restraint by", "drunkenly egged on"],
    ["horsepower", "tons of horsemeat"],
    ["gaffe","magic spell"],
    ["ancient","haunted"],
    ["star-studded","blood-soaked"],
    ["remains to be seen","will never be known"],
    ["silver bullet","way to kill werewolves"],
    ["subway system","tunnels I found"],
    ["suprising","suprising (but not to me)"],
    ["war of words","interplanetary war"],
    ["tension","sexual tension"],
    ["cautiously optimistic","delusional"],
    ["doctor who","the Big Bang Theory"],
    ["win votes","find Pokemon"],
    ["behind the headlines","beyond the grave"],
    ["email","poem"],
    ["facebook post","poem"],
    ["tweet","poem"],
    ["facebook ceo","this guy"],
    ["lastest","final"],
    ["disrupt","destroy"],
    ["meeting","ménage à trois"],
    ["scientists","Channing Tatum and his friends"],
    ["you won't belive","I'm really sad about"],
];

$(document).ready(() => {
    $("#submit").click(() => {
        const raw = $("#input").val();

        let working = raw;

        //replace words in raw using pairs in xkcdReplaceList
        for (const [a, b] of xkcdReplaceList) {
            working = working.replace(new RegExp(a, 'gi'), b);
        }

        $("#output").text(working);
    });
})