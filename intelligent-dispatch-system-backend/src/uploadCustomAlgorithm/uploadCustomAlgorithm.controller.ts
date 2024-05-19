import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Controller('uploadCustomAlgorithm')
export class UploadCustomAlgorithmController {
  @Post()
  @UseInterceptors(
    FileInterceptor('cppfile', {
      storage: diskStorage({
        destination: './uploadCustomAlgorithm',
        filename: (req, file, cb) => {
          const { originalname } = file;
          cb(null, originalname);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('algorithmName') algorithmName: string,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new HttpException('No C++ file uploaded', HttpStatus.BAD_REQUEST);
    }

    const gypContent = `{
    "targets": [
        {
            "target_name": "${algorithmName}",
            "sources": [ "uploadCustomAlgorithm/${algorithmName}.cc" ],
            "include_dirs": [
                "<!(node -p \\"require('node-addon-api').include\\")"
            ],
            "dependencies": [
                "<!(node -p \\"require('node-addon-api').gyp\\")"
            ],
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
        }
    ]
}`;

    fs.writeFileSync(path.join('../../binding.gyp'), gypContent);

    try {
      await this.runNodeGyp();

      // Dynamically load and call the compiled addon
      const addon = require(
        path.join(__dirname, `../../build/Release/${algorithmName}`),
      );

      // Check if the function exists in the addon
      if (typeof addon['main'] === 'function') {
        const result = addon['main']();

        // // Validate and format the result
        // if (this.validateOutput(result)) {
        //   return res.json({
        //     message: 'File uploaded, compiled, and executed successfully',
        //     result,
        //   });
        // } else {
        //   return res.status(400).json({ message: 'Invalid output format' });
        // }
        return res.json({
          message: 'File uploaded, compiled, and executed successfully',
          result,
        });
      } else {
        throw new HttpException(
          'Algorithm function not found in the uploaded file',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Compile or execution error: ${error.message}` });
    }
  }

  private runNodeGyp(): Promise<void> {
    return new Promise((resolve, reject) => {
      exec('npx node-gyp configure build', (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr));
        } else {
          resolve();
        }
      });
    });
  }

  private validateOutput(output: string): boolean {
    // Define your expected output format using a regex or other validation logic
    const outputPattern =
      /\/\d+AAA\d+\/\d+\/\d+\/\d+\/\d+\/*\d+\*.*#.*#.*#.*#.*\/.*/; // Example pattern
    return outputPattern.test(output);
  }
}
