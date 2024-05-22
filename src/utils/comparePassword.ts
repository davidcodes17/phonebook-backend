import bcrypt from "bcryptjs"

export const comparePassword = async ( password: string, userPassword: string ) => {
  return await bcrypt.compare( password, userPassword )
}

export default comparePassword