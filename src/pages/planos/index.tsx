import Head from 'next/head';
import {
    Button,
    Flex,
    Heading,
    Text,
    useMediaQuery
} from '@chakra-ui/react';

import { Sidebar } from '../../components/sidebar';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

interface PlanosProps{
    premium: boolean;
}

export default function Planos({premium}: PlanosProps){

    const [isMobile] = useMediaQuery("(max-width: 500px)");

    const handleSubscribe = async () => {

        if(premium){
            return;
        }

      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.post('/subscribe')

        const { sessionId } = response.data;

        const stripe = await getStripeJs();
        await stripe.redirectToCheckout({ sessionId: sessionId })

      } catch (err) {
        console.log(err);
        
      }  
    }

    async function handleCreatePortal(){
        
        try {
            
            if(!premium){
                return;
            }

            const apiClient = setupAPIClient();
            const response = await apiClient.post('/create-portal');

            const { sessionId } = response.data;

            window.location.href = sessionId;

        } catch (err) {
            console.log(err.message);
        }
    }

    return(
        <>
            <Head>
                <title>BarberPró - Sua assinatura Premium</title>
            </Head>
            <Sidebar>
                <Flex w="100%" direction="column" align="flex-start" justify="flex-start">
                    <Heading fontSize="2xl" mt={4} mb={4} mr={4} color="#fff">
                        Planos
                    </Heading>
                </Flex>

                <Flex pb={8} maxW="780px" w="100%" direction="column" alignContent="flex-start" justify="flex-start">
                    
                    <Flex gap={4} w="100%" flexDirection={isMobile ? "column" : "row"}>
                        <Flex rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading 
                            textAlign="center" 
                            color="#ffba3e" 
                            fontSize="2xl"
                            mt={2} mb={4}
                            >
                                Plano Grátis
                            </Heading>
                            <Text fontWeight="medium" ml={4} mb={2} color="#fffc3e">° Registrar serviços.</Text>
                            <Text fontWeight="medium" ml={4} mb={2} color="#fffc3e">° Criar apenas 6 modelos de cortes.</Text>
                            <Text fontWeight="medium" ml={4} mb={2} color="#fffc3e">° Editar dados do perfil.</Text>
                        </Flex>
                        <Flex rounded={4} p={2} flex={1} bg="barber.400" flexDirection="column">
                            <Heading 
                            textAlign="center" 
                            color="#46ef75" 
                            fontSize="2xl"
                            mt={2} mb={4}
                            >
                                Premium
                            </Heading>
                            <Text fontWeight="medium" ml={4} mb={2} color="#58f193">° Registrar serviços ilimitados.</Text>
                            <Text fontWeight="medium" ml={4} mb={2} color="#58f193">° Criar modelos de corte ilimitados.</Text>
                            <Text fontWeight="medium" ml={4} mb={2} color="#58f193">° Editar dados do perfil.</Text>
                            <Text fontWeight="medium" ml={4} mb={2} color="#58f193">° Editar tipos de corte.</Text>
                            <Text fontWeight="medium" ml={4} mb={2} color="#58f193">° Recebe todas atualizações.</Text>
                            <Text fontWeight="bold" ml={4} mb={2} fontSize="2xl" color="#ffffff">R$ 12,99</Text>

                            <Button
                            color="white"
                            size="md"
                            m={2}
                            border="1px"
                            borderColor="white"
                            bg={premium ? "transparent" : "button.cta"}
                            _hover={premium ? { bg: 'transparent', color: '#ffba3e'}: {bg: 'button.danger'}}
                            onClick={handleSubscribe}
                            disabled={premium}
                            >
                                {premium ? (
                                    "VOCÊ JÁ É PREMIUM"
                                ): (
                                    "VIRAR PREMIUM"
                                )
                            }
                            </Button>

                            {premium && (
                                <Button
                                m={2}
                                border="1px"
                                borderColor="red.900"
                                bg="transparent"
                                _hover={{bg:'transparent', color:'button.cta', borderColor: "white"}}
                                color="white"
                                fontWeight="bold"
                                onClick={handleCreatePortal}
                                >
                                    ALTERAR ASSINATURA
                                </Button>
                            )}

                        </Flex>

                    </Flex>

                </Flex>

            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/me');


        return{
            props: {
                premium: response.data?.subscriptions?.status === 'active' ? true : false
            }
        }
        
    } catch (err) {
        alert("Erro "+err);

        return{
            redirect:{
                destination: '/dashboard',
                permanent: false,
            }
        }
    }
    
})