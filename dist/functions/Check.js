"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function check(manager, message) {
    const player = manager.players.get(message.guild.id);
    if (!player) {
        throw new Error(`This guild (${message.guild.id}) doesn't have a player.`);
    }
    return player;
}
exports.default = check;
//# sourceMappingURL=Check.js.map