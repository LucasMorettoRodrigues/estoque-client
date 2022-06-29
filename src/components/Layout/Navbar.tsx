import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../services/auth.service";
import { updateAuthentication } from '../../features/authentication/authentication'

const Container = styled.div`
    background-color: #5fb4ff;
`
const Nav = styled.nav`
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 20px;
    height: 58px;
`
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`
const Title = styled.h1`
    flex: 1;
`
const List = styled.ul`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Item = styled.li`
    padding: 14px;
    color: #111;
    transition: all .2s ease-in-out;
    cursor: pointer;

    &:hover {
        color: #ffffff;
    }
`
const LeaveBtn = styled.button`
    padding: 8px 14px;
    border-radius: 5px;
    border: none;
    background-color: #168eff;
    font-size: 14px;
    margin-left: 10px;
    color: #222;
    font-weight: 800;
    transition: all .2s ease-in-out;
    cursor: pointer;

    &:hover {
        background-color: #007bee;
    }
`

export default function Navbar() {

    const auth = useAppSelector(state => state.authentication)
    const dispatch = useAppDispatch()

    const handleOnClick = () => {
        logout()
        dispatch(updateAuthentication())
    }

    return (
        <Container>
            <Nav>
                <Wrapper>
                    <Title><Link to='/panel' style={{ color: '#222' }}>Estoque</Link></Title>
                    {auth.authenticated &&
                        <List>
                            {auth.role === 'admin' &&
                                <>
                                    <Link to='/usuarios'><Item>Usuários</Item></Link>
                                    <Link to='/produtos/detalhes'><Item>Produtos</Item></Link>
                                    <Link to='/fornecedores'><Item>Fornecedores</Item></Link>
                                </>
                            }
                            <Link to='/inserir'><Item>Inserir</Item></Link>
                            <Link to='/retirar'><Item>Retirar</Item></Link>
                            {auth.role === 'admin' &&
                                <>
                                    <Link to='/ajustar'><Item>Ajustar</Item></Link>
                                </>
                            }
                            <Link to='/novoInventario'><Item>Inventário</Item></Link>
                            {auth.role === 'admin' &&
                                <>
                                    <Link to='/historico'><Item>Histórico</Item></Link>
                                </>
                            }
                            <LeaveBtn onClick={handleOnClick}>
                                Sair
                            </LeaveBtn>
                        </List>
                    }
                </Wrapper>
            </Nav>
        </Container>
    )
}
