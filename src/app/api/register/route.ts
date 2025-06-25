import { createUser, getUserByEmail } from "@/lib/db/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(request:NextRequest){

    try{
        const { email , password} = await request.json()

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            NextResponse.json({
                message:"User already exist"
            },{
                status:400
            }
        )
        }
        const hashedPassword = await bcrypt.hash(password,7)

        createUser({email , password})
        
        return NextResponse.json({
            message:"User Created!!!"
        })
    }catch(error){
        console.log(error)
        NextResponse.json({
            error:"Something went Wrong"
        },{ status:500 })
    }
};