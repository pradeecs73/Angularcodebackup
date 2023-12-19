import { DefaultAddressPipe } from './defaultAddress.pipe';

fdescribe('EllipsisPipe', () => {
  it('create an instance', () => {
    const pipe = new DefaultAddressPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform the lengh of string to given length + 3', () => {
    const pipe = new DefaultAddressPipe();
    const transformedValue = pipe.transform('opc.tcp://0.0.0');
    expect(transformedValue).toEqual('opc.tcp://0.0.0.0:0000');
    const transformedValue2 = pipe.transform('myvalue');
    expect(transformedValue2).toEqual('myvalue');
  });

});
