import { Request, Response } from "express";
import { ChangePassUserServices } from "../../Services/user/ChangePassUserServices";

class ChangePassUserController {
  async handle(req: Request, res: Response) {
    const id = req.user_id;
    const { pass, newPass } = req.body;
    const changePassUserServices = new ChangePassUserServices();
    const changePass = await changePassUserServices.execute({
      id,
      pass,
      newPass
    });
    return res.json(changePass);
    
  }
}

export { ChangePassUserController };
