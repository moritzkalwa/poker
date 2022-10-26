import { describe, expect, it } from "vitest"

import { getHandWorth } from "./deck"

describe('util', () => {

    describe('finds', () => {
        it('weird', () => {
            expect(getHandWorth([
                { face: 'club', value: '4' },
                { face: 'spade', value: '1' },
                { face: 'club', value: '7' },
                { face: 'diamond', value: 'jack' },
                { face: 'heart', value: 'king' }
              ], [ 
                { face: 'spade', value: '7' }, 
                { face: 'spade', value: '2' }
             ])).toStrictEqual({
                major: 1,
                minor: 7,
                cardIndeces: [2, 5]
             })
        })
        it('high card', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '1'},
                    {face: 'spade', value: '2'},
                    {face: 'diamond', value: '3'},
                    {face: 'diamond', value: '8'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'diamond', value: '6'},
                    {face: 'space', value: '7'},
                ])).toStrictEqual({
                    major: 0,
                    minor: 7,
                    cardIndeces: [6]
                })
        })
        it('high card with ace', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '9'},
                    {face: 'spade', value: '2'},
                    {face: 'diamond', value: '3'},
                    {face: 'diamond', value: '8'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'diamond', value: '6'},
                    {face: 'space', value: '1'},
                ])).toStrictEqual({
                    major: 0,
                    minor: 14,
                    cardIndeces: [6]
                })
        })
        it('pair', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '1'},
                    {face: 'spade', value: '2'},
                    {face: 'diamond', value: '3'},
                    {face: 'diamond', value: '8'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'diamond', value: '1'},
                    {face: 'space', value: '6'},
                ])).toStrictEqual({
                    major: 1,
                    minor: 14,
                    cardIndeces: [0, 5]
                })
        })
        it('two pair', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '1'},
                    {face: 'spade', value: '2'},
                    {face: 'diamond', value: '3'},
                    {face: 'diamond', value: '4'},
                    {face: 'heart', value: '6'},
                ], [
                    {face: 'diamond', value: '1'},
                    {face: 'space', value: '6'},
                ])).toStrictEqual({
                    major: 2,
                    minor: 14,
                    cardIndeces: [0, 5, 4, 6]
                })
        })
        it('three of a kind', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '1'},
                    {face: 'spade', value: '2'},
                    {face: 'diamond', value: '3'},
                    {face: 'diamond', value: '4'},
                    {face: 'heart', value: '6'},
                ], [
                    {face: 'diamond', value: '6'},
                    {face: 'space', value: '6'},
                ])).toStrictEqual({
                    major: 3,
                    minor: 6,
                    cardIndeces: [4, 5, 6]
                })
        })
        it('straight', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '1'},
                    {face: 'spade', value: '2'},
                    {face: 'diamond', value: '3'},
                    {face: 'diamond', value: '4'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'diamond', value: '1'},
                    {face: 'space', value: '6'},
                ])).toStrictEqual({
                    major: 4,
                    minor: 6,
                    cardIndeces: [1, 2, 3, 4, 6]
                })
        })
        it('straight with ace', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '7'},
                    {face: 'spade', value: '2'},
                    {face: 'diamond', value: '3'},
                    {face: 'diamond', value: '4'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'diamond', value: '1'},
                    {face: 'space', value: '8'},
                ])).toStrictEqual({
                    major: 4,
                    minor: 5,
                    cardIndeces: [5, 1, 2, 3, 4]
                })
        })
        it('flush', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '7'},
                    {face: 'heart', value: '2'},
                    {face: 'heart', value: '3'},
                    {face: 'diamond', value: '4'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'heart', value: '1'},
                    {face: 'space', value: '8'},
                ])).toStrictEqual({
                    major: 5,
                    minor: 14,
                    cardIndeces: [5, 0, 4, 2, 1]
                })
        })
        it('full house', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '2'},
                    {face: 'heart', value: '2'},
                    {face: 'heart', value: '3'},
                    {face: 'diamond', value: '5'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'heart', value: '1'},
                    {face: 'space', value: '5'},
                ])).toStrictEqual({
                    major: 6,
                    minor: 5,
                    cardIndeces: [3, 4, 6, 0, 1]
                })
        })
        it('full house with ace', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '2'},
                    {face: 'heart', value: '2'},
                    {face: 'heart', value: '1'},
                    {face: 'diamond', value: '5'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'heart', value: '1'},
                    {face: 'space', value: '5'},
                ])).toStrictEqual({
                    major: 6,
                    minor: 14,
                    cardIndeces: [3, 4, 6, 2, 5]
                })
        })
        it('four of a kind', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '5'},
                    {face: 'heart', value: '2'},
                    {face: 'heart', value: '1'},
                    {face: 'diamond', value: '5'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'heart', value: '1'},
                    {face: 'space', value: '5'},
                ])).toStrictEqual({
                    major: 7,
                    minor: 5,
                    cardIndeces: [0, 3, 4, 6]
                })
        })
        it('four of a kind with ace', () => {
            expect(getHandWorth([
                    {face: 'heart', value: '5'},
                    {face: 'heart', value: '2'},
                    {face: 'heart', value: '1'},
                    {face: 'diamond', value: '1'},
                    {face: 'heart', value: '5'},
                ], [
                    {face: 'heart', value: '1'},
                    {face: 'space', value: '1'},
                ])).toStrictEqual({
                    major: 7,
                    minor: 14,
                    cardIndeces: [2, 3, 5, 6]
                })
        })
    })

    
})