import SharePoint from '../sample/model/SharePoint';
// import * as React from 'react';  
// import { configure, mount, ReactWrapper } from 'enzyme';  
// import * as Adapter from 'enzyme-adapter-react-16';  
describe('SharePoint model', () => {
    it('should create a SharePoint instance', () => {
        let s = new SharePoint();
        expect(s).toEqual({
            _env: 0
        });
    });

    it('should set SharePoint._env to the passed argument \'1\'', () => {
        let s = new SharePoint();
        s.env = 1;
        expect(s).toEqual({
            _env: 1
        });
    });

    it('should throw an error when EnvType is out of range', () => {
        let s = new SharePoint();
        expect(() => {
            s.env = 3;
        }).toThrow(TypeError);
    });

    it('should return the \'env\' value when the getter \'env\' called', () => {
        let s = new SharePoint();
        expect(s.env).toEqual(0);
    });

    it('should set SharePoint._version to the passed argument \'15.0.4693.1000\'', () => {
        let s = new SharePoint();
        s.version = '15.0.4693.1000';
        expect(s).toEqual({
            _env: 0,
            _version: '15.0.4693.1000'
        });
    });

    it('should return the \'version\' value when the getter \'version\' called', () => {
        let s = new SharePoint();
        s.version = '15.0.4693.1000';
        expect(s.version).toEqual('15.0.4693.1000');
    });
});