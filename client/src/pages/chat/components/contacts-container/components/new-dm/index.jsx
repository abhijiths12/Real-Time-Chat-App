import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Lottie from "react-lottie"
import { apiClient } from "@/lib/api-client"
import { CONTACTS_ROUTES, SEARCH_CONTACTS_ROUTES } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { useAppStore } from "@/store"
  

const NewDM = () => {

    const {setSelectedChatType, setSelectedChatData} = useAppStore()

    const [openNewContactModel, setOpenContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async(searchTerm) => {
        try{
            if(searchTerm.length>0){
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTES,{ searchTerm }, {withCredentials: true }

                );
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                    console.log(searchedContacts)
                }
            }
            else {
                setSearchedContacts([]);
            }
        }
        catch(error){
            console.error(error)
        }
    }


    const selectNewContact = (contact) => {
                setOpenContactModel(false);
                setSelectedChatType('contact');
                setSelectedChatData(contact)
                setSearchedContacts([]);
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={() => setOpenContactModel(true)}/></TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        select new contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewContactModel} onOpenChange={setOpenContactModel}>
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center">Please select a contact</DialogTitle>
                        <DialogDescription>


                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search contacts" className="rounded-lg p-6 bg-[#2c2e3b]" onChange={e=>searchContacts(e.target.value)}/>
                    </div>

                    {
                        searchedContacts.length>0 && (
                     
                    

                    <ScrollArea className="h-[250px]">
                        <div className="flex flex-col gap-5">
                            {searchedContacts.map((contact,index) => {
                                return(
                                    <div key={contact.id || index} className="flex gap-3 items-center cursor-pointer" onClick={() => selectNewContact(contact)}>
                                        
                                        <div className="w-12 h-12 relative">
                                            
                                                            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                                {contact.image ? (<AvatarImage src={`${HOST}/${contact.image}`} className="object-cover w-full h-full bg-black" />) : (<div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center ${getColor(contact.color)}`}>
                                                                    {contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()}
                                        
                                        
                                                                </div>
                                                                )}
                                                            </Avatar>
                                                        </div>

                                                        <div className="flex flex-col">
                                                           <span> {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}`: ''}
                                                           </span>

                                                           <span className="text-xs">{contact.email}</span>
                                                        </div>

                                    </div> 
                                )
                                })
                            }
                        </div>
                    </ScrollArea>

)
}


                    {
                        searchContacts.length <= 0 && (
                            <div className="flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all xl:hidden">
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={200}
                                    width={200}
                                    options={animationDefaultOptions}
                                />

                                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
                                    <h3 className="poppins-medium">
                                        Hi <span className="text-purple-500">!</span>Welcome to
                                        <span className="text-purple-500">Syncronus</span> <span>Chat App</span>

                                        <span className="text-purple-500">,</span>

                                    </h3>
                                </div>
                            </div>
                        )
                    }

                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDM