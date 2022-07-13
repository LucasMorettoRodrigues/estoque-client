import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import Button from "../components/UI/Button"
import Form from "../components/UI/Form"
import Input from "../components/UI/Input"
import Loading from "../components/UI/Loading"
import { updateAuthentication } from "../features/authentication/authentication"
import { getUser, login } from "../services/auth.service"

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
`
const Wrapper = styled.div`
    background-color: white;
    max-width: 400px;
    padding: 30px 30px 10px 30px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
`
const Title = styled.h2`
    margin-bottom: 20px;
    text-align: center;
`
const Message = styled.div`
    width: 100%;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #ffc1c1;
    color: #ff3333;
    border-radius: 5px;
    font-size: 14px;
`
const InputContainer = styled.div`
    margin-bottom: 20px;
    width: 100%;
`

const Login = () => {

    const dispatch = useAppDispatch()
    const auth = useAppSelector(state => state.authentication)
    const navigate = useNavigate()

    useEffect(() => {
        if (auth.authenticated) {
            console.log(auth.role)
            if (auth.role === 'admin') {
                navigate('/inbox')
            } else {
                navigate('/retirar')
            }
        }
    }, [auth.authenticated, auth.role, navigate])

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!user || !password) return setError("Preencha todos os campos.")

        setIsLoading(true)

        try {
            await login(user, password)
        } catch (error: any) {
            console.log(error)
            return setError(error.response.data)
        } finally {
            setIsLoading(false)
        }
        dispatch(updateAuthentication())

        if (getUser().user.role === 'admin') {
            navigate('/inbox')
        } else {
            console.log(auth)
            navigate('/retirar')
        }
    }

    return (
        <>
            <Loading loading={isLoading} />
            <Container>
                <Wrapper>
                    <Title>Login</Title>
                    {error && <Message>{error}</Message>}
                    <Form onSubmit={handleSubmit}>
                        <InputContainer>
                            <Input
                                name="user"
                                label="Usuario"
                                onChange={(e) => setUser(e.target.value)}
                                required
                            />
                        </InputContainer>
                        <InputContainer>
                            <Input
                                type="password"
                                name="password"
                                label="Senha"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputContainer>
                        <Button text="Entrar" style={{ width: '100%' }} />
                    </Form>
                </Wrapper>
            </Container>
        </>
    )
}

export default Login
