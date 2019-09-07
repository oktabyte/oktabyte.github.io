/* exported preload, setup, draw, mouseClicked*/
"use strict";

/* eslint-disable no-magic-numbers */

const cards = [
    "DiamondsA", "Diamonds2", "Diamonds3", "Diamonds4", "Diamonds5", "Diamonds6", "Diamonds7", "Diamonds8", "Diamonds9", "Diamonds10", "DiamondsJ", "DiamondsQ", "DiamondsK",
    "ClubsA", "Clubs2", "Clubs3", "Clubs4", "Clubs5", "Clubs6", "Clubs7", "Clubs8", "Clubs9", "Clubs10", "ClubsJ", "ClubsQ", "ClubsK",
    "HeartsA", "Hearts2", "Hearts3", "Hearts4", "Hearts5", "Hearts6", "Hearts7", "Hearts8", "Hearts9", "Hearts10", "HeartsJ", "HeartsQ", "HeartsK",
    "SpadesA", "Spades2", "Spades3", "Spades4", "Spades5", "Spades6", "Spades7", "Spades8", "Spades9", "Spades10", "SpadesJ", "SpadesQ", "SpadesK",
    "Joker", "Joker"
];

const WIDTH = 800;
const HEIGHT = 600;
const CARD_WIDTH = 140;
const CARD_HEIGHT = 190;

const SCALE = 0.5;
const CARD_S_WIDTH = CARD_WIDTH * SCALE;
const CARD_S_HEIGHT = CARD_HEIGHT * SCALE;

const COLORS = {
    "WHITE": [255, 255, 255]
};
const CARDS_IN_A_DECK = 54;
const defaultdeck = [];

/* eslint-enable no-magic-numbers */

let deck;
let stack;
let discardPile;
let cardback;

function preload() {
    createDefaultDeck();
    deck = shuffle(defaultdeck);
    cardback = loadImage("assets/img/cardBack_blue3.png");
}

function setup() {
    // Do single time prep stuff here
    createCanvas(WIDTH, HEIGHT);
    stack = deck;
    discardPile = [];
}

function draw() {
    // Do all repeating / looping stuff here
    background(COLORS.WHITE);

    drawSpaces();

    if (stack.length > 0) {
        image(cardback, 0, 0, CARD_S_WIDTH, CARD_S_HEIGHT);
    }
    if (discardPile.length > 0) {
        image(discardPile[discardPile.length - 1].img, 0, CARD_S_HEIGHT + 2, CARD_S_WIDTH, CARD_S_HEIGHT);
    }

    
}


// **********************
// *    Mouse Events    *
// **********************

function mouseClicked() {
    if (stack.length > 0) {
        const card = stack.pop();

        discardPile.push(card);
    } else {
        stack = discardPile;
        discardPile = [];
    }
}

function createDefaultDeck() {
    for (let i = 0; i < CARDS_IN_A_DECK; i++) {
        defaultdeck.push({
            "name": cards[i],
            "img": loadImage(`assets/img/card${cards[i]}.png`)
        });
    }
}

function drawSpaces() {
    noFill();
    rect(1, 1, CARD_S_WIDTH - 2, CARD_S_HEIGHT - 2);
    rect(1, CARD_S_HEIGHT + 3, CARD_S_WIDTH - 2, CARD_S_HEIGHT - 2);
}