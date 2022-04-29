import { fireEvent, render } from '@testing-library/react';
import Comprar from '../Comprar'
import * as reactRedux from 'react-redux'
import { BrowserRouter } from 'react-router-dom';

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}))

const useSelectorMock = reactRedux.useSelector as jest.MockedFunction<typeof reactRedux.useSelector>;
const useDispatchMock = reactRedux.useDispatch as jest.MockedFunction<any>;

const mockStore = {
    fornecedor: { fornecedores: [{ id: 1, name: 'fornecedor_item' }] },
    produto: { produtos: [{ id: 1, name: 'produto_item' }] }
}

const MockNovoFornecedor = () => {
    return (
        <BrowserRouter>
            <Comprar />
        </BrowserRouter>
    )
}

describe('Integration test of Comprar Form', () => {

    beforeEach(() => {
        useDispatchMock.mockImplementation(() => () => { });
        useSelectorMock.mockImplementation((selector: any) => selector(mockStore));
    })

    afterEach(() => {
        useDispatchMock.mockClear();
        useSelectorMock.mockClear();
    });

    it('should add product to list', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        fireEvent.change(getByLabelText('Produto'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Preço'), { target: { value: '10.00' } })
        fireEvent.change(getByLabelText('Lote'), { target: { value: 'lote_item' } })
        fireEvent.change(getByLabelText('Validade'), { target: { value: '2022-01-01' } })
        fireEvent.change(getByLabelText('Quantidade'), { target: { value: '5' } })
        fireEvent.click(getByRole('button', { name: 'Lançar' }))

        expect(getByText('fornecedor_item')).toBeInTheDocument()
        expect(getByText('produto_item')).toBeInTheDocument()
        expect(getByText('10.00')).toBeInTheDocument()
        expect(getByText('lote_item')).toBeInTheDocument()
        expect(getByText('2022-01-01')).toBeInTheDocument()
        expect(getByText('5')).toBeInTheDocument()
    })

    it('should sum quantities when two equal products are added to list', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        let i = 0

        while (i !== 2) {
            fireEvent.change(getByLabelText('Produto'), { target: { value: '1' } })
            fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '1' } })
            fireEvent.change(getByLabelText('Preço'), { target: { value: '10.00' } })
            fireEvent.change(getByLabelText('Lote'), { target: { value: 'lote_item' } })
            fireEvent.change(getByLabelText('Validade'), { target: { value: '2022-01-01' } })
            fireEvent.change(getByLabelText('Quantidade'), { target: { value: '100' } })
            fireEvent.click(getByRole('button', { name: 'Lançar' }))
            i++
        }

        expect(getByText('200')).toBeInTheDocument()
    })

    it('should get Error if product does not exists', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        fireEvent.change(getByLabelText('Produto'), { target: { value: '2' } })
        fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Preço'), { target: { value: '10.00' } })
        fireEvent.change(getByLabelText('Lote'), { target: { value: 'lote_item' } })
        fireEvent.change(getByLabelText('Validade'), { target: { value: '2022-01-01' } })
        fireEvent.change(getByLabelText('Quantidade'), { target: { value: '5' } })
        fireEvent.click(getByRole('button', { name: 'Lançar' }))

        expect(getByText('Erro')).toBeInTheDocument()
    })

    it('should get Message if provider does not exists', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        fireEvent.change(getByLabelText('Produto'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '2' } })
        fireEvent.change(getByLabelText('Preço'), { target: { value: '10.00' } })
        fireEvent.change(getByLabelText('Lote'), { target: { value: 'lote_item' } })
        fireEvent.change(getByLabelText('Validade'), { target: { value: '2022-01-01' } })
        fireEvent.change(getByLabelText('Quantidade'), { target: { value: '5' } })
        fireEvent.click(getByRole('button', { name: 'Lançar' }))

        expect(getByText('Atenção')).toBeInTheDocument()
    })

    it('should get Error if price is not declared', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        fireEvent.change(getByLabelText('Produto'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Lote'), { target: { value: 'lote_item' } })
        fireEvent.change(getByLabelText('Validade'), { target: { value: '2022-01-01' } })
        fireEvent.change(getByLabelText('Quantidade'), { target: { value: '5' } })
        fireEvent.click(getByRole('button', { name: 'Lançar' }))

        expect(getByText('Erro')).toBeInTheDocument()
    })

    it('should get Error if lote is not declared', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        fireEvent.change(getByLabelText('Produto'), { target: { value: '2' } })
        fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Preço'), { target: { value: '10.00' } })
        fireEvent.change(getByLabelText('Validade'), { target: { value: '2022-01-01' } })
        fireEvent.change(getByLabelText('Quantidade'), { target: { value: '5' } })
        fireEvent.click(getByRole('button', { name: 'Lançar' }))

        expect(getByText('Erro')).toBeInTheDocument()
    })

    it('should get Error if validity is not declared', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        fireEvent.change(getByLabelText('Produto'), { target: { value: '2' } })
        fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Preço'), { target: { value: '10.00' } })
        fireEvent.change(getByLabelText('Lote'), { target: { value: 'lote_item' } })
        fireEvent.change(getByLabelText('Quantidade'), { target: { value: '5' } })
        fireEvent.click(getByRole('button', { name: 'Lançar' }))

        expect(getByText('Erro')).toBeInTheDocument()
    })

    it('should get Error if quantity is not declared', async () => {
        const { getByLabelText, getByRole, getByText } = render(
            <MockNovoFornecedor />
        );

        fireEvent.change(getByLabelText('Produto'), { target: { value: '2' } })
        fireEvent.change(getByLabelText('Fornecedor'), { target: { value: '1' } })
        fireEvent.change(getByLabelText('Preço'), { target: { value: '10.00' } })
        fireEvent.change(getByLabelText('Lote'), { target: { value: 'lote_item' } })
        fireEvent.change(getByLabelText('Validade'), { target: { value: '2022-01-01' } })
        fireEvent.click(getByRole('button', { name: 'Lançar' }))

        expect(getByText('Erro')).toBeInTheDocument()
    })
})


