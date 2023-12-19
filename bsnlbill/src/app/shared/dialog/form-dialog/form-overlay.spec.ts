import { FormOverlay } from "./form-overlay";
class overlay extends FormOverlay{
    title: string;
}
fdescribe('form overlay service', () => {
     let service :overlay;
     beforeEach(()=>{
        service = new overlay();
     })
     it('expect getTitle to return title string',()=>{
        service.title = 'title';
        let result = service.getTitle();
        expect(result).toBe('title');
     })
})