import { Button } from "@/components/ui/button";
import Background from "@/assets/login2.png"
import Victory from "@/assets/victory.svg"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {apiClient} from "@/lib/api-client.jsx";
import { LOGIN_ROUTE, SIGNUP_ROUTES } from "@/utils/constants.jsx";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
// import { apiClient } from "@/lib/api-client";
// import { apiClient } from "@/lib/api-client";

const Auth = () => {

    const navigate = useNavigate()
    const {setUserInfo} = useAppStore();
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const validatelogin = () => {
        if(!email.length) {
            toast.error("Email is required");
            return false;
        }
        if(!password.length) {
            toast.error("Password is required")
            return false;
        }
        return true;
    }

    const validateSignup = () => {
        if(!email.length) {
            toast.error('Email is required');
            return false
        }

        if(!password.length) {
            toast.error('password is required');
            return false
        }

        if(password!==confirmPassword){
            toast.error('password and confirm password should be same')
            return false
        }


        return true;
    };

    const handlelogin =  async() => {
        if(validatelogin){
            const response  = await apiClient.post(LOGIN_ROUTE,{email,password},{withCredentials:true})
        console.log({response})

       
            if(response.data.user.id) {
                setUserInfo(response.data.user)
                if(response.data.user.profileSetup) navigate('/chat');
                else navigate("/profile");
            }
        }
        
    }

    const handlesignup = async() => {
        
        if(validateSignup()) {
            const response = await apiClient.post(SIGNUP_ROUTES, {email, password},{withCredentials:true})
            alert("done");

            if( response.status=== 201 ){
                setUserInfo(response.data.user)

                navigate('/profile');
            }

            console.log( 'response'+{response})
        }
        
    }
    return(
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
            <div className="flex flex-col gap-10 items-center justify-center">
            <div className="flex items-center justify-center flex-col">

                <div className="flex items-center justify-center">
                    <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                    <img src={Victory} className="h-[100px]"></img>
                </div>

                <p className="font-medium text-center">Fill in the details to get started with the best chat app!</p>
                </div>

                <div className="flex items-center justify-center w-full">
                    <Tabs className="w-3/4" defaultValue="login">
                        <TabsList className="bg-transparent rounded-none w-full">
                            <TabsTrigger value='login' className="data-[state=acitve]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>

                            <TabsTrigger value='signup' className="data-[state=acitve]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Signup</TabsTrigger>
                        </TabsList>
                        <TabsContent className="flex flex-col gap-5 mt-10" value='login'>
                            <Input placeholder='Email' type="email" className="rounded-full p-6" onChange={(e) => setEmail(e.target.value)}/>
                            

                            
                        <Input placeholder='Password' type="password" className="rounded-full p-6" onChange={(e) => setPassword(e.target.value)}/>
                        
                        <Button className="rounded-full p-6" onClick={handlelogin}>Login</Button>

                        </TabsContent>

                        <TabsContent className="flex flex-col gap-5" value='signup'>
                        <Input placeholder='Email' type="text" className="rounded-full p-6" onChange={(e) => setEmail(e.target.value)}/>
                    
                            
                                <Input placeholder='Password' type="password" className="rounded-full p-6" onChange={(e) => setPassword(e.target.value)} />

                                <Input placeholder='Confirm Password' type="password" className="rounded-full p-6" onChange={(e) => setConfirmPassword(e.target.value)} />

                        <Button className="rounded-full p-6" onClick={handlesignup}>Signup</Button>

                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="hidden xl:flex justify-center items-center">
                <img src={Background} className="h-[500px]"/>
            </div>

            </div> 
        </div>
        
    )
}

export default Auth 