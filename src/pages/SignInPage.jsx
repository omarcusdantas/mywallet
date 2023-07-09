import styled from "styled-components";
import { Link } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useRef, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";


export default function SignInPage() {
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const { setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    function signin(data) {
        axios
            .post(import.meta.env.VITE_API_URL, data)
            .then((response) => {
                const newUserData = {
                    token: response.data,
                };
                localStorage.setItem("user", JSON.stringify(newUserData));
                setUserData(newUserData);
                navigate("/home");
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                return alert(error.message);                
            });
    }

    function handleForm(event) {
        event.preventDefault();

        const data = {
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (data.password.length < 3) {
            return alert("Password must have at least 3 characters");
        }

        if (!emailPattern.test(data.email)) {
            return alert("Invalid email address");
        }

        signin(data);
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData(user);
            navigate("/home");
        }
    }, []);

    return (
        <SingInContainer>
            <form onSubmit={handleForm}>
                <MyWalletLogo />
                <input placeholder="E-mail" type="email" ref={emailInputRef} required data-test="email"/>
                <input placeholder="Senha" type="password" autoComplete="new-password" ref={passwordInputRef} required data-test="password"/>
                <button data-test="sign-in-submit">Entrar</button>
            </form>

            <Link to={"/cadastro"}>Primeira vez? Cadastre-se!</Link>
        </SingInContainer>
    );
}

const SingInContainer = styled.section`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
