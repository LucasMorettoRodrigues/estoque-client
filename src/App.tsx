import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Container from "./components/UI/Container";
import Loading from "./components/UI/Loading";
import Navbar from "./components/Layout/Navbar";
import { getFornecedores } from "./features/provider/providerSlice";
import { getProducts } from "./features/product/productSlice";
import Inserir from "./pages/Actions/Inserir";
import Detalhes from "./pages/Produtos/Detalhes";
import ProdutosEscondidos from "./pages/Produtos/Arquivados";
import EditarFornecedor from "./pages/Providers/EditarFornecedor";
import EditarSubProduto from "./pages/Produtos/EditarSubProduto";
import Fornecedores from "./pages/Providers/Fornecedores";
import ListOperations from "./pages/Historic/ListOperations";
import NovoFornecedor from "./pages/Providers/NovoFornecedor";
import Produtos from "./pages/Produtos/Resumo";
import Retirar from "./pages/Actions/Retirar";
import ProdutoHistorico from "./components/ProdutoHistorico";
import Ajustar from "./pages/Actions/Ajustar";
import Login from "./pages/Login";
import Users from "./pages/Users/Users";
import CreateUser from "./pages/Users/CreateUser";
import AdminPanel from "./pages/AdminPanel";
import EditUser from "./pages/Users/EditUser";
import RedefinePassword from "./pages/Users/RedefinePassword";
import ListNotifications from "./pages/Historic/ListNotifications";
import Inventario from "./pages/Inventario/Inventario";
import VizualizarInventario from "./pages/Inventario/VisualizarInventario";
import ListInventarios from "./pages/Historic/ListInventarios";
import { getAllHistoric } from "./features/historic/historicSlice";
import OnHold from "./pages/Aliquot/ToAliquot";
import Aliquoting from "./pages/Aliquot/Aliquoting";
import NovoProdutoTwo from "./pages/Produtos/CreateProduct";
import EditProduct from "./pages/Produtos/EditProduct";
import DashBoard from "./pages/DashBoard";

function App() {

  const dispatch = useAppDispatch()
  const authentication = useAppSelector(state => state.authentication)

  useEffect(() => {
    if (authentication.authenticated) {
      dispatch(getProducts())
      dispatch(getFornecedores())
      dispatch(getAllHistoric())
    }
  }, [dispatch, authentication])


  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    if (!authentication.authenticated) return <Navigate to="/login" />
    return children
  }

  const AdminRoute = ({ children }: { children: JSX.Element }) => {
    if (!authentication.authenticated) return <Navigate to="/login" />
    if (authentication.role !== 'admin') return <Navigate to="/retirar" />
    return children
  }

  return (
    <BrowserRouter>
      <Loading loading={false} />
      <Navbar />
      <Container>
        <Routes>
          <Route path='/' element={<Login />} />

          <Route path='/login' element={<Login />} />
          <Route path='/estoque-client' element={<Login />} />

          <Route path='/novoInventario' element={<PrivateRoute><Inventario /></PrivateRoute>} />
          <Route path='/inserir' element={<PrivateRoute><Inserir /></PrivateRoute>} />
          <Route path='/retirar' element={<PrivateRoute><Retirar /></PrivateRoute>} />

          <Route path='/produtos' element={<AdminRoute><Produtos /></AdminRoute>} />
          <Route path='/produtos/detalhes' element={<AdminRoute><Detalhes /></AdminRoute>} />
          <Route path='/produtos/escondidos' element={<AdminRoute><ProdutosEscondidos /></AdminRoute>} />
          <Route path='/produtos/:id' element={<AdminRoute><EditProduct /></AdminRoute>} />
          <Route path='/produtos/:id_produto/subprodutos/:id_subproduto' element={<AdminRoute><EditarSubProduto /></AdminRoute>} />
          <Route path='/novoProduto' element={<AdminRoute><NovoProdutoTwo /></AdminRoute>} />
          <Route path='/fornecedores' element={<AdminRoute><Fornecedores /></AdminRoute>} />
          <Route path='/fornecedores/:id' element={<AdminRoute><EditarFornecedor /></AdminRoute>} />
          <Route path='/novoFornecedor' element={<AdminRoute><NovoFornecedor /></AdminRoute>} />
          <Route path='/ajustar' element={<AdminRoute><Ajustar /></AdminRoute>} />
          <Route path='/historico' element={<AdminRoute><ListOperations /></AdminRoute>} />
          <Route path='/produtos/:id/historico' element={<AdminRoute><ProdutoHistorico /></AdminRoute>} />
          <Route path='/usuarios' element={<AdminRoute><Users /></AdminRoute>} />
          <Route path='/usuarios/novo' element={<AdminRoute><CreateUser /></AdminRoute>} />
          <Route path='/panel' element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path='/usuarios/:id' element={<AdminRoute><EditUser /></AdminRoute>} />
          <Route path='/usuarios/:id/redefinirSenha' element={<AdminRoute><RedefinePassword /></AdminRoute>} />
          <Route path='/inventarios/:id' element={<AdminRoute><VizualizarInventario /></AdminRoute>} />

          <Route path='/dashboard/' element={<AdminRoute><DashBoard /></AdminRoute>} />

          <Route path='/historico/notificacoes' element={<AdminRoute><ListNotifications /></AdminRoute>} />
          <Route path='/historico/inventarios' element={<AdminRoute><ListInventarios /></AdminRoute>} />

          <Route path='/aliquotagem/em-espera' element={<PrivateRoute><OnHold /></PrivateRoute>} />
          <Route path='/aliquotagem/:productId/:subProductId' element={<PrivateRoute><Aliquoting /></PrivateRoute>} />

        </Routes>
      </Container>
    </BrowserRouter >
  );
}

export default App;
