import { useState } from "react";
import Head from "next/head";
import { Sidebar } from "../../../components/sidebar";
import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input
} from '@chakra-ui/react';

import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi';

import { canSSRAuth } from "../../../utils/canSSRAuth";
import { setupAPIClient } from "../../../services/api";
import Router from  'next/router';

interface NewHaircutProps{
    subscription: boolean;
    count: number;
}

export default function NewHaircut({ subscription, count}: NewHaircutProps){

    const [isMobile] = useMediaQuery("(max-width: 500px)");

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    async function handleRegister(){
        if(name=== '' || price === ''){
            alert("Preenchatodos os campos!");
            return;
        }

        try {
            
            const apiClient = setupAPIClient();
            await apiClient.post('/haircut', {
                name: name,
                price: Number(price),
            });

            alert("Serviço cadastrado com sucesso!");
            Router.push('/haircuts');

        } catch (err) {
            console.log(err);
            alert("Erro ao cadastrar esse serviço!");
        }
    }

    return(
        <>
            <Head>
                <title>BarberPró - Novo Serviço ou corte</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    <Flex
                    direction={isMobile ? "column" : "row"}
                    w="100%"
                    align={isMobile ? "flex-start" : "center"}
                    mb={isMobile ? 4 : 0}
                    >
                        <Link href="/haircuts">
                            <Button
                            bg="gray.700"
                            _hover={{bg: "gray.600"}}
                            color="white"
                             p={4}
                             display="flex" 
                             alignItems="center" 
                             justifyContent="center"
                             mr={4}
                             >
                            <FiChevronLeft size={22} color="#FFF" />
                                Voltar
                            </Button>
                        </Link>
                        <Heading
                        color="red.900"
                        mt={4}
                        mb={4}
                        mr={4}
                        fontSize={isMobile ? "24px" : "2xl"}
                        >
                            Modelos de Serviço
                        </Heading>
                    </Flex>

                    <Flex
                    maxW="700px"
                    bg="barber.400"
                    w="100%"
                    rounded={10}
                    align="center"
                    justify="center"
                    pt={8}
                    pb={8}
                    direction="column"
                    >
                        <Heading 
                        color="white" 
                        fontSize={isMobile ? "22px" : "2xl"}
                        mb={4}
                        >
                          Cadastrar modelo
                        </Heading>
                        <Input
                        color="gray.200"
                        placeholder="Nome do serviço"
                        size="md"
                        type="text"
                        w="85%"
                        bg="gray.900"
                        mb={3}
                        disabled={!subscription && count >= 4}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                         />

                        <Input
                        color="gray.200"
                        placeholder="Valor do serviço Ex: 9.99"
                        size="md"
                        type="text"
                        w="85%"
                        bg="gray.900"
                        mb={4}
                        disabled={!subscription && count >= 4}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                         />

                         <Button
                         w="85%"
                         size="md"
                         color="white"
                         mb={6}
                         bg="button.cta"
                         _hover={{bg: "button.danger"}}
                         disabled={!subscription && count >= 4}
                         onClick={handleRegister}
                         >
                            Cadastrar
                         </Button>
                            {!subscription && count >= 6 && (
                               <Flex direction="row" align="center" justifyContent="center">
                                <Text color="gray.200">
                                    Você atingiou seu limite de serviços.
                                </Text>
                                <Link href="/planos">
                                    <Text fontWeight="bold" ml={2} color="#31FB6A" cursor="pointer">
                                        Seja premium
                                    </Text>
                                </Link>
                               </Flex> 
                            )}
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async(ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);

        const response = await apiClient.get('/haircut/check');
        const count = await apiClient.get('/haircut/count');

        return{
            props:{
                subscription: response.data?.subscriptions?.status === 'active' ? true : false,
                count: count.data
            }
        }

    } catch (err) {
        alert(err);

        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})