import { text, heading, panel } from '@metamask/snaps-ui';
import { Snap } from '../interface';

export async function signHathorTransaction(origin: string, snap: Snap, message: string): Promise<{ signedMessage: string }> {
  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'Confirmation',
      content: panel([
        heading('Sign transaction'),
        text(`${origin} is trying to sign the following transaction:`),
        text('Inputs:'),
        text('HGmtnuGUsT4CqTtbt1BqmSYVqydtqWKcnb: 6.00 HTR (000000000000...49ffc62c5780)'),
        text('HC474KpFj4WgZkGe6gno5qC3Tqyii71L1x: 5.00 HTR (000000000000...46a5b618b2e3)'),
        text('  '),
        text('Outputs:'),
        text('HVqqSq9Sf3sJP32ZzcBAnTLy4KhcL4V4P7 (Our address): 8.00 HTR'),
        text('HC474KpFj4WgZkGe6gno5qC3Tqyii71L1x: 3.00 HTR'),
      ]),
    },
  });

  return {
    signedMessage: '--', // signature.toString('base64'),
  };
}
