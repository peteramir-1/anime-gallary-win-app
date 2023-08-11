import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetAllAnimesDocument,
  GetAnimeByIdDocument,
  Status,
  Type,
  UpdateAnimeGQL,
} from 'src/app/graphql/generated/graphql';
import { ElectronService } from 'src/app/common/services/electron.service';
import { CreateAnimeGQL } from 'src/app/graphql/generated/graphql';
import { UtilsService } from 'src/app/common/services/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-anime',
  templateUrl: './add-anime.component.html',
  styleUrls: ['./add-anime.component.scss'],
})
export class AddAnimeComponent implements OnInit {
  prevAnime = this.activeRoute.snapshot.data.anime;
  _animeForm = this.fb.group({
    name: this.fb.control<string>('', Validators.required),
    story: this.fb.control<string | null>(null),
    thumbnail: this.fb.control<string>('assets/pictures/no-image.webp'),
    numOfEpisodes: this.fb.control<number>(1, [
      Validators.required,
      Validators.min(1),
    ]),
    episodes: this.fb.array([this.fb.control('')]),
    status: this.fb.control<Status.Complete | Status.InComplete>(
      Status.Complete,
      Validators.required
    ),
    type: this.fb.control<Type.Movie | Type.Ova | Type.Serie>(
      Type.Serie,
      Validators.required
    ),
    addFromFileOrFolder: this.fb.control('file'),
  });
  thumbnailDefault = true;
  private _episodes = this._animeForm.get('episodes') as FormArray;
  enableScroll: () => void;

  constructor(
    private fb: FormBuilder,
    private electronService: ElectronService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private createAnimeGql: CreateAnimeGQL,
    private updateAnimeGql: UpdateAnimeGQL,
    private renderer: Renderer2,
    private snackbar: MatSnackBar,
    public utilService: UtilsService
  ) {}

  ngOnInit(): void {
    this._animeForm
      .get('numOfEpisodes')
      .valueChanges.subscribe(numOfEpisodes =>
        this.updateEpisodesArray(numOfEpisodes)
      );
    if (!!this.prevAnime) {
      this.updateAnimeFormValue(this.prevAnime);
    }
  }
  private updateAnimeFormValue(prevAnime: any) {
    this._animeForm.get('name').setValue(prevAnime.name);
    this._animeForm.get('story').setValue(prevAnime.description);
    this._animeForm.get('thumbnail').setValue(prevAnime.thumbnail);
    if (
      this._animeForm.get('thumbnail').value !== 'assets/pictures/no-image.webp'
    )
      this.thumbnailDefault = false;
    this._animeForm.get('numOfEpisodes').setValue(prevAnime.numOfEpisodes);
    this._animeForm.get('type').setValue(prevAnime.type);
    this._animeForm.get('status').setValue(prevAnime.status);
    for (const [index, control] of this._episodes.controls.entries()) {
      control.setValue(prevAnime.episodes[index]);
    }
  }

  updateEpisodesArray(currentNum: number) {
    if (currentNum < 1) {
      this._animeForm.get('numOfEpisodes').setValue(1);
    }
    this.changeEpisodesArrayToMatch(this._animeForm.get('numOfEpisodes').value);
  }
  private changeEpisodesArrayToMatch(numOfEpisode: number) {
    if (numOfEpisode < this._episodes.length) {
      const length = this._episodes.length;
      for (let i = 0; i <= length - numOfEpisode; i++) {
        this._episodes.removeAt(this._episodes.length - 1);
      }
    } else {
      const length = this._episodes.length;
      for (let i = 0; i < numOfEpisode - length; i++) {
        this._episodes.push(this.fb.control(''));
      }
    }
  }

  disableScroll() {
    this.enableScroll = this.renderer.listen(
      window,
      'keydown',
      this.preventDefaultForScrollKeys
    );
  }
  private preventDefaultForScrollKeys(e: any) {
    const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
      e.preventDefault();
      return false;
    }
  }

  getEpisodesLength() {
    return Array(this._episodes.length);
  }

  selectAnimePicture(dropEvent?: any) {
    if (dropEvent === undefined) {
      this.selectFromDialog();
    } else {
      this.selectFromDragDrop(dropEvent);
    }
  }
  private selectFromDialog() {
    this.electronService
      .selectFile(['bmp', 'png', 'jpg', 'gif', 'jpeg'])
      .then(path => {
        if (!!path) {
          const validPath = this.utilService.convertPathToValidPath(path);
          this._animeForm.get('thumbnail').setValue(validPath);
          this.thumbnailDefault = false;
        }
      });
  }
  private selectFromDragDrop(dropEvent: any) {
    dropEvent.preventDefault();
    dropEvent.stopPropagation();
    const imageAllowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/x-png',
    ];
    const file = dropEvent.dataTransfer.files[0];
    if (imageAllowedTypes.includes(file.type)) {
      const validPath = this.utilService.convertPathToValidPath(file.path);
      this._animeForm.get('thumbnail').setValue(validPath);
      this.thumbnailDefault = false;
    }
  }

  selectEpisodesFromFolder() {
    this.electronService.selectFilesFromFolder().then(res => {
      if (!!res?.data) {
        if (res.data.length === 0) {
          this.resetEpisodes();
        } else {
          const files = this.sortFilesByEpisodeNumber(
            this.filterFilesByExtensions(res.data, ['mp4', 'mkv', 'flv', 'mwv'])
          );
          this._animeForm.get('numOfEpisodes').setValue(files.length);
          this.saveFilesToAnimeForm(files);
          this._animeForm.get('addFromFileOrFolder').setValue('file');
        }
      }
    });
  }
  private resetEpisodes() {
    this._animeForm.get('');
    this._episodes.clear();
    this._episodes.push(this.fb.control(''));
  }
  private filterFilesByExtensions(
    files: string[],
    extensions: string[]
  ): string[] {
    return files.filter(file =>
      extensions.some(extension => file.endsWith(extension))
    );
  }
  private sortFilesByEpisodeNumber(files: string[]): string[] {
    return files.sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
  }
  private saveFilesToAnimeForm(files: string[]) {
    for (const [index, control] of this._episodes.controls.entries()) {
      control.setValue(files[index]);
    }
  }

  submit() {
    if (this._animeForm.valid) {
      if (this._animeForm.dirty) {
        if (!!this.prevAnime) {
          this.editAnime(this.prevAnime.id);
        } else {
          this.createAnime();
        }
      } else {
        if (!!this.prevAnime) {
          this.router.navigate(['/library', 'details', this.prevAnime.id]);
        }
      }
    }
  }

  private createAnime() {
    this.createAnimeGql
      .mutate(
        {
          createAnimeInput: {
            name: this._animeForm.get('name').value,
            type: this._animeForm.get('type').value,
            status: this._animeForm.get('status').value,
            numOfEpisodes: this._animeForm.get('numOfEpisodes').value,
            thumbnail: this._animeForm.get('thumbnail').value,
            description: this._animeForm.get('story').value,
            episodes: this._animeForm.get('episodes').value,
          },
        },
        {
          refetchQueries: [{ query: GetAllAnimesDocument }],
        }
      )
      .subscribe(res => {
        this.router
          .navigate(['/library', 'details', res.data.createAnime.id])
          .then(() => {
            this.snackbar.open('created successfully');
          });
      });
  }

  private editAnime(id: string) {
    this.updateAnimeGql
      .mutate(
        {
          updateAnimeInput: {
            id,
            name: this._animeForm.get('name').value,
            type: this._animeForm.get('type').value,
            status: this._animeForm.get('status').value,
            numOfEpisodes: this._animeForm.get('numOfEpisodes').value,
            thumbnail: this._animeForm.get('thumbnail').value,
            description: this._animeForm.get('story').value,
            episodes: this._animeForm.get('episodes').value,
          },
        },
        {
          refetchQueries: [
            { query: GetAnimeByIdDocument, variables: { animeId: id } },
          ],
        }
      )
      .subscribe(() => {
        this.router.navigate(['/library', 'details', id]).then(() => {
          this.snackbar.open('updated successfully');
        });
      });
  }
}
