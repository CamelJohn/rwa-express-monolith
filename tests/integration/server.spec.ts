import express from 'express';
import { app } from '../../src';

describe('Express App', () => {
    it('should be defined', async () => {
        expect(app).toBeDefined();
        expect(app).toBeInstanceOf(express.application.constructor);
    });
});
