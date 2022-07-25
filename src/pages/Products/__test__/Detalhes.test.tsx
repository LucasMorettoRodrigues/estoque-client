import { render } from '@testing-library/react';
import Detalhes from '../ProductsDetail'
import { BrowserRouter } from 'react-router-dom';
import { mockStore, useSelectorMock } from '../../../__mocks__/redux';

const MockDetalhes = () => {
    return (
        <BrowserRouter>
            <Detalhes />
        </BrowserRouter>
    )
}

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
}))

describe('Detalhes Tests', () => {

    beforeEach(() => {
        useSelectorMock.mockImplementation((selector: any) => selector(mockStore));
    })

    afterEach(() => {
        useSelectorMock.mockClear();
    });

    it('should render product and subproducts', async () => {
        const { getByText } = render(
            <MockDetalhes />
        );

        expect(getByText('Agulhas')).toBeInTheDocument()
        expect(getByText('Lote: 1234')).toBeInTheDocument()
    })

    it('should not render hidden product', async () => {
        const { queryByText } = render(
            <MockDetalhes />
        );

        expect(queryByText('Ampolas')).not.toBeInTheDocument()
    })
})