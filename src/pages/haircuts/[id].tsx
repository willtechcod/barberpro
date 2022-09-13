import { useState, ChangeEvent } from "react";
import Head from "next/head";
import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
    Stack,
    Switch
} from '@chakra-ui/react';

import { Sidebar } from "../../components/sidebar";
import { FiChevronLeft } from 'react-icons/fi'
import Link from "next/link";
import Router from  'next/router';

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";


interface HaircutProps{
    id: string;
    name: string;
    price:  string | number;
    status: boolean;
    user_id: string;
}

interface SubscriptionProps{
    id: string;
    status: string;
}

interface EditHaircutProps{
    haircut: HaircutProps;
    subscription: SubscriptionProps | null;
}

export default function EditHaircut({ subscription, haircut }: EditHaircutProps){
const [isMobile] = useMediaQuery("(max-width: 500px)");

    const [name, setName] = useState(haircut?.name);
    const [price, setPrice] = useState(haircut?.price);
    const [status, setStatus] = useState(haircut?.status);

    const [disableHaircut, setDisableHaircut] = useState(haircut?.status ? "disabled": "enabled");

    function handleChangeStatus(e: ChangeEvent<HTMLInputElement>){
        if(e.target.value === 'disabled'){
            setDisableHaircut("enabled");
            setStatus(false);
        }else{
            setDisableHaircut("disabled");
            setStatus(true);
        }
    }

    async function handleUpdate(){
        if(name === '' || price === ''){
            alert("Preencha todos os campos!")
            return;
        }

        try {
            
            const apiClient = setupAPIClient();
            await apiClient.put('/haircut', {
                name: name,
                price: Number(price),
                status: status,
                haircut_id: haircut?.id
            })
            alert("Serviço atualizado com sucesso!")
            Router.push('/haircuts');

        } catch (err) {
            alert(err);
        }
    }

    return(
        <>
            <Head>
                <title>Editando modelo de serviço - BarberPró</title>
            </Head>
            <Sidebar>
                <Flex flexDirection="column" alignItems="flex-start" justifyContent="flex-start">

                   <Flex
                    direction={isMobile ? "column": "row"}
                    w="100%"
                    alignItems={isMobile ? "flex-start" : "center"}
                    justifyContent="flex-start"
                    mb={isMobile ? 4 : 0}
                   >
                    <Link href="/haircuts">
                        <Button
                        p={4}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.700"
                        _hover={{bg: "gray.600"}}
                        color="white"
                        mr={3}
                        >
                            <FiChevronLeft size={22} color="#FFF" />
                            Voltar
                        </Button>
                    </Link>
                    
                    <Heading 
                    fontSize={isMobile ? "22px" : "2xl"} 
                    color="red.900" 
                    size="xl"
                    >
                       Editar serviço 
                    </Heading>
                   </Flex> 

                    <Flex 
                    maxW="700px"
                    pt={8}
                    pb={8}
                    w="100%"
                    bg="barber.400"
                    direction="column"
                    align="center"
                    justify="center"
                    rounded={10}
                    mt={4}
                    >
                      <Heading
                      color="white"
                      fontSize={isMobile ? "22px" : "2xl"} 
                      mb={4}
                      >
                        Editar serviço
                      </Heading>

                      <Flex
                      w="85%"
                      direction="column"
                      >
                        <Input
                         placeholder="Nome do serviço"
                         bg="gray.900"
                         color="gray.200"
                         mb={3}
                         size="md"
                         type="text"
                         w="100%"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         disabled={subscription?.status !== 'active'}
                         />

                        <Input
                         placeholder="Valor do serviço Ex 00.90"
                         bg="gray.900"
                         color="gray.200"
                         mb={3}
                         size="md"
                         type="number"
                         w="100%"
                         value={price}
                         onChange={(e) => setPrice(e.target.value)}
                         disabled={subscription?.status !== 'active'}
                         />

                         <Stack
                         mb={6}
                         align="center"
                         direction="row"
                         >
                            <Text fontWeight="bold" color="white">Desativar serviço</Text>
                            <Switch
                            size="md"
                            colorScheme="orange"
                            value={disableHaircut}
                            isChecked={disableHaircut === 'disabled' ? false : true}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e)}
                            disabled={subscription?.status !== 'active'}
                             />
                         </Stack>

                         <Button
                         bg="red.900"
                         color="white"
                         _hover={{bg:"button.danger"}}
                         w="100%"
                         disabled={subscription?.status !== 'active'}
                         onClick={handleUpdate}
                         >
                            Salvar
                         </Button>

                         { subscription?.status !== 'active' && (
                            <Flex
                            direction="row"
                            align="center"
                            justify="center"
                            mt={4}
                            >
                                <Link href="/planos">
                                    <Text fontWeight="bold"  mr={2} color="#31fb6a" cursor="pointer">
                                        Seja premium
                                    </Text>
                                </Link>
                                <Text color="white">
                                    e tenha todos acessos liberados.
                                </Text>
                            </Flex>
                         )}

                      </Flex>
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const {id} = ctx.params;

    try {

        const apiClient = setupAPIClient(ctx);

        const check = await apiClient.get('/haircut/check');

        const response = await apiClient.get('/haircut/detail', {
            params:{
                haircut_id: id,
            }
        })

        return{
            props:{
               haircut: response.data,
               subscription: check.data?.subscriptions
            }
        }


    } catch (err) {

        alert(err);

        return{
            redirect:{
                destination: '/haircuts',
                permanent: false
            }
        }
    }

})