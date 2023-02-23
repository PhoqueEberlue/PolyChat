import { io, Socket } from 'socket.io-client';
import { middleware_ip, socket_port } from "../../config.json";

class SocketioService {
  socket: Socket;
  constructor() {}

  setup() {
    this.socket = io(`http://${middleware_ip}:${socket_port}`);
  }
	emit(evt: string, msg:Array<String> | String) {
		if(msg instanceof Array)
			this.socket.emit(evt, ...msg);//spread args, same as *list in python
		else 
			this.socket.emit(evt, msg);
	}

	on(evt: string, callback: (x: any[]) => void) {
		this.socket.on(evt, callback);
	}

	close() {
		this.socket.close();
	}
}

export default new SocketioService();
